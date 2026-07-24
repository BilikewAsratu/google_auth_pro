CREATE DATABASE registration_system;
USE registration_system;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NULL, -- We keep this null for now, but feel free to add signup later
    role ENUM('user', 'admin') DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP table
CREATE TABLE otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL, -- We will hash this
    expires_at DATETIME NOT NULL,
    UNIQUE KEY unique_email (email) -- One active OTP per email
);

-- Insert a dummy admin and user for testing
INSERT INTO users (email, role, is_verified) VALUES 
('admin@test.com', 'admin', TRUE),
('john@test.com', 'user', TRUE);