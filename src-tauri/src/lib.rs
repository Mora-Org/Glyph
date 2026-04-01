mod gpu;
mod export;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            gpu::detect_gpu_encoder,
            export::write_frames,
            export::export_video,
            export::cleanup_frames,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
