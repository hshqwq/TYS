use std::env;

pub fn init() {
    let dir = match env::current_exe() {
        Ok(path) => path.parent().unwrap().to_path_buf(),
        Err(_err) => env::current_dir().unwrap(),
    };
    env::set_current_dir(dir).unwrap();
}
