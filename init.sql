CREATE TABLE IF NOT EXISTS user (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(100),
  user_email VARCHAR(100) UNIQUE,
  password TEXT,
  last_update TIMESTAMP,
  create_on TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
  note_id INT AUTO_INCREMENT PRIMARY KEY,
  note_title VARCHAR(255),
  note_content TEXT,
  user_id INT,
  last_update TIMESTAMP,
  created_on TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);
