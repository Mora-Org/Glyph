/// gpu.rs — Detecta o melhor encoder H.264 disponível no sistema.
/// Ordem de preferência: NVENC (Nvidia) → AMF (AMD) → QSV (Intel) → libx264 (CPU).
use std::process::Command;

/// Retorna o nome do encoder FFmpeg a usar na exportação.
#[tauri::command]
pub async fn detect_gpu_encoder() -> String {
    tokio::task::spawn_blocking(|| {
        let output = Command::new("ffmpeg")
            .args(["-hide_banner", "-encoders"])
            .output();

        match output {
            Ok(out) => {
                // FFmpeg imprime encoders tanto em stdout quanto stderr
                let text = String::from_utf8_lossy(&out.stdout).to_string()
                    + &String::from_utf8_lossy(&out.stderr).to_string();

                if text.contains("h264_nvenc") {
                    "h264_nvenc".to_string()
                } else if text.contains("h264_amf") {
                    "h264_amf".to_string()
                } else if text.contains("h264_qsv") {
                    "h264_qsv".to_string()
                } else {
                    "libx264".to_string()
                }
            }
            // FFmpeg não encontrado ou erro — fallback seguro
            Err(_) => "libx264".to_string(),
        }
    })
    .await
    .unwrap_or_else(|_| "libx264".to_string())
}
