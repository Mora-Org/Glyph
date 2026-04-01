/// export.rs — Escreve frames PNG no disco e spawna o FFmpeg com monitoramento de progresso.
use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use base64::Engine;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter};

// ── Tipos ─────────────────────────────────────────────────────────────────────

#[derive(Deserialize)]
pub struct FrameData {
    /// Índice global do frame (determina o nome do arquivo).
    pub index: u32,
    /// PNG como data URL: "data:image/png;base64,..."
    pub data_url: String,
}

#[derive(Serialize, Clone)]
pub struct ExportProgress {
    pub percentage: f64,
    pub status: String,      // "rendering" | "done" | "error"
    pub message: Option<String>,
}

// ── Comandos Tauri ────────────────────────────────────────────────────────────

/// Escreve a sequência de frames PNG na pasta temporária.
/// Chamado antes de export_video, em lotes, para não explodir a memória.
#[tauri::command]
pub async fn write_frames(frames_dir: String, frames: Vec<FrameData>) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        std::fs::create_dir_all(&frames_dir)
            .map_err(|e| format!("Erro ao criar pasta de frames: {e}"))?;

        for frame in &frames {
            let base64_data = frame
                .data_url
                .strip_prefix("data:image/png;base64,")
                .ok_or("Formato data URL inválido — esperado 'data:image/png;base64,...'")?;

            let bytes = base64::engine::general_purpose::STANDARD
                .decode(base64_data)
                .map_err(|e| format!("Erro ao decodificar frame {}: {e}", frame.index))?;

            let path = format!("{}/frame_{:06}.png", frames_dir, frame.index);
            std::fs::write(&path, &bytes)
                .map_err(|e| format!("Erro ao salvar frame {}: {e}", frame.index))?;
        }

        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Spawna o FFmpeg com os args fornecidos pelo builder TS e emite eventos de progresso.
/// O frontend escuta o evento "export-progress" via @tauri-apps/api/event.
#[tauri::command]
pub async fn export_video(
    app: AppHandle,
    args: Vec<String>,
    total_duration: f64,
) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        // Loga o comando completo para inspeção (critério de aceite do plano)
        println!("[PEG Export] ffmpeg {}", args.join(" "));

        let mut child = Command::new("ffmpeg")
            .args(&args)
            .stdout(Stdio::null())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| format!("Falha ao iniciar FFmpeg: {e}"))?;

        let stderr = child.stderr.take().expect("stderr piped");
        let reader = BufReader::new(stderr);

        for line in reader.lines() {
            let line = line.map_err(|e| e.to_string())?;

            // FFmpeg emite linhas como: "frame=  30 fps= 29 ... time=00:00:01.00 ..."
            if let Some(pct) = parse_progress(&line, total_duration) {
                let _ = app.emit("export-progress", ExportProgress {
                    percentage: pct,
                    status:     "rendering".to_string(),
                    message:    None,
                });
            }
        }

        let status = child.wait().map_err(|e| e.to_string())?;

        if status.success() {
            let _ = app.emit("export-progress", ExportProgress {
                percentage: 100.0,
                status:     "done".to_string(),
                message:    None,
            });
            Ok(())
        } else {
            let msg = "FFmpeg encerrou com erro. Verifique se todos os assets estão acessíveis.".to_string();
            let _ = app.emit("export-progress", ExportProgress {
                percentage: 0.0,
                status:     "error".to_string(),
                message:    Some(msg.clone()),
            });
            Err(msg)
        }
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Remove a pasta de frames temporários após a exportação.
#[tauri::command]
pub async fn cleanup_frames(frames_dir: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        std::fs::remove_dir_all(&frames_dir)
            .map_err(|e| format!("Erro ao limpar frames: {e}"))
    })
    .await
    .map_err(|e| e.to_string())?
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/// Extrai o percentual de progresso a partir de uma linha do stderr do FFmpeg.
/// Formato esperado: "...time=HH:MM:SS.ms..."
fn parse_progress(line: &str, total_duration: f64) -> Option<f64> {
    let pos = line.find("time=")?;
    let rest = &line[pos + 5..];
    let time_str = rest.split_whitespace().next()?;
    let seconds = parse_time_to_seconds(time_str)?;
    Some((seconds / total_duration * 100.0).clamp(0.0, 99.0))
}

/// Converte "HH:MM:SS.ms" para segundos f64.
fn parse_time_to_seconds(s: &str) -> Option<f64> {
    let parts: Vec<&str> = s.split(':').collect();
    if parts.len() != 3 {
        return None;
    }
    let h: f64 = parts[0].parse().ok()?;
    let m: f64 = parts[1].parse().ok()?;
    let s: f64 = parts[2].parse().ok()?;
    Some(h * 3600.0 + m * 60.0 + s)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_time() {
        assert_eq!(parse_time_to_seconds("00:00:01.00"), Some(1.0));
        assert_eq!(parse_time_to_seconds("00:01:30.50"), Some(90.5));
        assert_eq!(parse_time_to_seconds("01:00:00.00"), Some(3600.0));
        assert_eq!(parse_time_to_seconds("invalid"), None);
    }

    #[test]
    fn test_parse_progress() {
        let line = "frame=  30 fps= 29 q=28.0 size=     256kB time=00:00:01.00 bitrate=2097.2kbits/s speed=0.97x";
        let pct = parse_progress(line, 10.0);
        assert_eq!(pct, Some(10.0));
    }
}
