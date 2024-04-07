use std::{env::consts::OS, ffi::OsStr, path::Path, process::Command};

pub fn open_with_file_manager<P>(path: P) -> Result<String, String>
where
  P: AsRef<OsStr> + AsRef<Path>,
{
  let path = Path::new(&path);

  if !path.exists() {
    return Err(format!("'{}' does not exist", path.to_str().unwrap()).into());
  }

  let mut cmd = if OS == "windows" {
    Command::new("explorer")
  } else if OS == "linux" || OS == "macos" {
    Command::new("xdg-open")
  } else {
    return Err(format!("Unsupported OS: {}", OS));
  };

  match cmd.arg(path.canonicalize().unwrap().to_str().unwrap()).spawn() {
    Ok(_) => Ok("Succeed".into()),
    Err(e) => Err(format!("Failed to open with file manager: {}", e)),
  }
}

#[tauri::command]
pub fn open_with_file_manager_cmd(path: String) -> Result<String, String> {
  open_with_file_manager(path)
}
