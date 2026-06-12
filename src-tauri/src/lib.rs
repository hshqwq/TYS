// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

mod file_list;
mod open_with_file_manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            file_list::get_scripts,
            file_list::set_base_dir,
            open_with_file_manager::open_with_file_manager_cmd
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
