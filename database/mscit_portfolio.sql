CREATE DATABASE IF NOT EXISTS mscit_portfolio;
USE mscit_portfolio;

-- =====================================
-- ADMIN TABLE
-- =====================================

CREATE TABLE admin (

    id INT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

INSERT INTO admin(username,password)
VALUES('admin','admin123');

-- =====================================
-- STUDENTS TABLE
-- =====================================

CREATE TABLE students (

    id INT AUTO_INCREMENT PRIMARY KEY,

    student_id VARCHAR(20) NOT NULL UNIQUE,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(100),

    phone VARCHAR(20),

    about TEXT,

    skills TEXT,

    profile_image VARCHAR(255),

    cover_image VARCHAR(255),

    resume VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================
-- PROJECTS TABLE
-- =====================================

CREATE TABLE projects (

    id INT AUTO_INCREMENT PRIMARY KEY,

    student_id VARCHAR(20) NOT NULL,

    category ENUM(
        'Canva',
        'Photoshop',
        'CorelDRAW',
        'Word',
        'Excel',
        'PowerPoint',
        'Web Development'
    ) NOT NULL,

    title VARCHAR(255) NOT NULL,

    file_name VARCHAR(255) NOT NULL,

    file_type VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);