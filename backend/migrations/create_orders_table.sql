-- Create orders table for Event Tool
CREATE TABLE IF NOT EXISTS orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    customer_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    
    issue_date DATE NOT NULL,
    return_date DATE NOT NULL,
    
    delivery_address VARCHAR(500),
    city VARCHAR(100),
    delivery_type VARCHAR(50),
    
    total_price DECIMAL(10, 2),
    deposit_amount DECIMAL(10, 2),
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    
    status VARCHAR(50) DEFAULT 'pending',
    source VARCHAR(50) DEFAULT 'event_tool',
    
    customer_comment TEXT,
    manager_comment TEXT,
    
    event_board_id VARCHAR(36),
    event_type VARCHAR(100),
    guests_count INT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_customer_id (customer_id),
    INDEX idx_order_number (order_number),
    INDEX idx_issue_date (issue_date),
    INDEX idx_status (status),
    INDEX idx_source (source),
    INDEX idx_event_board_id (event_board_id),
    
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (event_board_id) REFERENCES event_boards(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
