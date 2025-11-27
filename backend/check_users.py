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
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    
    with connection.cursor() as cursor:
        cursor.execute("SELECT customer_id, email, firstname, lastname, password_hash FROM customers LIMIT 10")
        customers = cursor.fetchall()
        
        print("📊 Користувачі в базі:")
        print("=" * 80)
        
        if customers:
            for c in customers:
                has_password = "✅ Є пароль" if c['password_hash'] else "❌ Немає пароля"
                print(f"ID: {c['customer_id']}")
                print(f"Email: {c['email']}")
                print(f"Ім'я: {c['firstname']} {c['lastname']}")
                print(f"Пароль: {has_password}")
                print("-" * 80)
        else:
            print("Користувачів не знайдено")
    
    connection.close()
    
except Exception as e:
    print(f"❌ Помилка: {e}")
