import pymysql

db_config = {
    'host': 'farforre.mysql.tools',
    'port': 3306,
    'database': 'farforre_rentalhub',
    'user': 'farforre_rentalhub',
    'password': '-nu+3Gp54L'
}

try:
    connection = pymysql.connect(
        host=db_config['host'],
        port=db_config['port'],
        user=db_config['user'],
        password=db_config['password'],
        database=db_config['database'],
        charset='utf8mb4'
    )
    
    with connection.cursor() as cursor:
        # Check current structure
        cursor.execute("DESCRIBE customers")
        columns = cursor.fetchall()
        column_names = [col[0] for col in columns]
        
        print("Поточні колонки в customers:")
        for col in column_names:
            print(f"  - {col}")
        print()
        
        # Add columns if they don't exist
        if 'password_hash' not in column_names:
            print("Додаю password_hash...")
            cursor.execute("ALTER TABLE customers ADD COLUMN password_hash VARCHAR(255)")
            print("✅ password_hash додано")
        
        if 'is_active' not in column_names:
            print("Додаю is_active...")
            cursor.execute("ALTER TABLE customers ADD COLUMN is_active TINYINT(1) DEFAULT 1")
            print("✅ is_active додано")
        
        if 'email_verified' not in column_names:
            print("Додаю email_verified...")
            cursor.execute("ALTER TABLE customers ADD COLUMN email_verified TINYINT(1) DEFAULT 0")
            print("✅ email_verified додано")
        
        if 'created_at' not in column_names:
            print("Додаю created_at...")
            cursor.execute("ALTER TABLE customers ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
            print("✅ created_at додано")
        
        if 'last_login' not in column_names:
            print("Додаю last_login...")
            cursor.execute("ALTER TABLE customers ADD COLUMN last_login DATETIME")
            print("✅ last_login додано")
        
        connection.commit()
        print("\n✅ Всі колонки успішно додані!")
    
    connection.close()
    
except Exception as e:
    print(f"❌ Помилка: {e}")
