CREATE TABLE IF NOT EXISTS buses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  driver_name VARCHAR(100) NOT NULL,
  driver_username VARCHAR(80) UNIQUE,
  driver_password_hash VARCHAR(255),
  status ENUM('idle', 'active', 'delayed', 'completed') NOT NULL DEFAULT 'idle',
  current_lat DECIMAL(10, 7) NULL,
  current_lng DECIMAL(10, 7) NULL
);

CREATE TABLE IF NOT EXISTS routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  stops JSON NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  bus_id INT NOT NULL,
  CONSTRAINT fk_routes_bus
    FOREIGN KEY (bus_id) REFERENCES buses(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  parent_phone VARCHAR(30) NOT NULL,
  parent_username VARCHAR(80) UNIQUE,
  parent_password_hash VARCHAR(255),
  bus_id INT NOT NULL,
  route_id INT NOT NULL,
  CONSTRAINT fk_students_bus
    FOREIGN KEY (bus_id) REFERENCES buses(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_students_route
    FOREIGN KEY (route_id) REFERENCES routes(id)
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS parent_notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  type ENUM('departure', 'near_stop', 'arrival', 'delay') NOT NULL,
  message VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_student
    FOREIGN KEY (student_id) REFERENCES students(id)
    ON DELETE CASCADE
);
