// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

use std::path;

use tauri::PhysicalSize;

mod file_list;
mod open_with_file_manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let app = tauri::Builder::default()
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![
      file_list::get_scripts,
      file_list::set_base_dir,
      open_with_file_manager::open_with_file_manager_cmd
    ])
    .setup(|app| {
      let args: Vec<String> = std::env::args().collect();
      let mut base_path= "".to_string();
      let mut start_path= "".to_string();

      if args.len() > 1 {
        let start_arg = &args[1];
        if std::fs::exists(start_arg).unwrap() {
          let path = path::absolute(start_arg).unwrap();
          if path.is_file() {
            if path.extension().unwrap() == "ykm" {start_path = String::from(start_arg)};
            base_path = path.parent().unwrap().to_str().unwrap().to_string();
          } else if path.is_dir() {
            base_path = String::from(start_arg);
          }
        }
      }

      let url = format!("/?baseDir={}&start={}", base_path,start_path);

      let builder = tauri::WebviewWindowBuilder::new(
        app,
        "main",
        tauri::WebviewUrl::App(url.into()),
      )
        .resizable(true)
        .min_inner_size(480.0,480.0);
      let win = builder.build().unwrap();
       win.set_size(tauri::Size::Physical(PhysicalSize {width: 1920, height: 1080})).unwrap();
       win.set_title("TYS").unwrap();
       win.show().unwrap();

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
