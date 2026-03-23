-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS testdb1;
USE testdb1;

-- Table for storing user information
CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    _password VARCHAR(255) NOT NULL
);

-- Table for storing admin information
CREATE TABLE IF NOT EXISTS admins (
    email VARCHAR(255) PRIMARY KEY,
    _password VARCHAR(255) NOT NULL
);

-- Table for storing game details
CREATE TABLE IF NOT EXISTS games (
    id INT PRIMARY KEY,
    _name VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL,
    detail TEXT NOT NULL,
    catagory VARCHAR(100) NOT NULL
);

-- Table for storing user wishlists
CREATE TABLE IF NOT EXISTS wishlist (
    email VARCHAR(255) NOT NULL,
    id INT NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email),
    FOREIGN KEY (id) REFERENCES games(id)
);

-- Table for storing user shopping carts
CREATE TABLE IF NOT EXISTS cart (
    email VARCHAR(255) NOT NULL,
    id INT NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email),
    FOREIGN KEY (id) REFERENCES games(id)
);

-- Table for storing game comments
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    gameid INT NOT NULL,
    comm TEXT NOT NULL
);

-- Table for storing bill/purchase reports
CREATE TABLE IF NOT EXISTS billreport (
    email VARCHAR(255) NOT NULL,
    fname VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    total INT NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email)
);

-- Insert a default admin account for initial setup
INSERT INTO admins (email, _password) VALUES ('admin@admin.com', 'admin') ON DUPLICATE KEY UPDATE email=email;
