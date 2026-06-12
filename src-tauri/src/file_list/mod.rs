use serde::ser::{Serialize, SerializeStruct, Serializer};
use std::{cmp::min, fs, path::Path};

pub enum FileType {
    YkmScript,
    Dir,
}

pub struct FileInfo {
    name: String,
    path: String,
    file_type: FileType,
    summary: String,
}

impl Serialize for FileInfo {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut s = serializer.serialize_struct("FileInfo", 4)?;
        s.serialize_field("name", &self.name)?;
        s.serialize_field("path", &self.path)?;
        s.serialize_field(
            "file_type",
            match &self.file_type {
                FileType::YkmScript => "0",
                FileType::Dir => "1",
            },
        )?;
        s.serialize_field("summary", &self.summary)?;
        s.end()
    }
}

#[tauri::command]
pub fn get_scripts(path: String, max_len: usize) -> Vec<FileInfo> {
    let target_dir = Path::new(&path);

    if !target_dir.exists() || !target_dir.is_dir() {
        return vec![];
    }

    let res = fs::read_dir(target_dir)
        .unwrap()
        .map(|file| file.map(|e| e.path()))
        .filter(|path| {
            let path = path.as_ref().unwrap();
            if path.is_dir() {
                return true;
            }

            let ext = path.extension();

            match ext {
                Some(ext) => ext == "ykm",
                None => false,
            }
        })
        .map(|path| {
            let path = path.unwrap();

            let name = path
                .file_name()
                .unwrap()
                .to_str()
                .unwrap()
                .to_string()
                .into();
            let file_path = fs::canonicalize(&path)
                .unwrap()
                .to_str()
                .unwrap()
                .replace("\\", "/")
                .to_string()
                .into();

            if path.is_dir() {
                return FileInfo {
                    name: name,
                    path: file_path,
                    file_type: FileType::Dir,
                    summary: "".to_string().into(),
                };
            }

            let file = fs::read_to_string(path).unwrap();
            let summary = file[0..min(file.len(), max_len)].to_string().into();

            FileInfo {
                name: name,
                path: file_path,
                file_type: FileType::YkmScript,
                summary: summary,
            }
        })
        .collect();

    res
}

#[tauri::command]
pub fn set_base_dir() -> Result<String, String> {
    if let Some(path) = rfd::FileDialog::new().pick_folder() {
      Ok(path.to_str().unwrap().replace("\\", "/").to_string())
    } else {
      Err("No folder selected".to_string())
    }
}
