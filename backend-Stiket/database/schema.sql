CREATE DATABASE IF NOT EXISTS stackit_db;
USE stackit_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    avatar VARCHAR(255),
    reputation INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    views INT DEFAULT 0,
    votes INT DEFAULT 0,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Answers table
CREATE TABLE answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    votes INT DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tags table
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question Tags junction table
CREATE TABLE question_tags (
    question_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (question_id, tag_id),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Votes table
CREATE TABLE votes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    votable_type ENUM('question', 'answer') NOT NULL,
    votable_id INT NOT NULL,
    vote_type ENUM('upvote', 'downvote') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_vote (user_id, votable_type, votable_id)
);

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('answer', 'comment', 'mention', 'vote') NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample tags
INSERT INTO tags (name, description) VALUES 
('javascript', 'JavaScript programming language'),
('react', 'React.js library'),
('node', 'Node.js runtime'),
('mysql', 'MySQL database'),
('html', 'HTML markup language'),
('css', 'CSS styling'),
('express', 'Express.js framework'),
('jwt', 'JSON Web Tokens');

-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@stackit.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');