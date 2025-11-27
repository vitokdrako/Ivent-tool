import pymysql
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

db_config = {
    'host': 'farforre.mysql.tools',
    'port': 3306,
    'database': 'farforre_rentalhub',
    'user': 'farforre_rentalhub',
    'password': '-nu+3Gp54L'
}

# Тестовий користувач
test_user = {
    'email': 'test@farfordecor.com',
    'password': 'test123456',  # Мінімум 6 символів
    'firstname': 'Тестовий',
    'lastname': 'Користувач',
    'telephone': '+380501234567'
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
        # Check if user exists
        cursor.execute("SELECT * FROM customers WHERE email = %s", (test_user['email'],))
        existing = cursor.fetchone()
        
        if existing:
            print(f"✅ Користувач вже існує!")
            print(f"Email: {test_user['email']}")
            print(f"Пароль: {test_user['password']}")
            
            # Update password
            password_hash = pwd_context.hash(test_user['password'])
            cursor.execute("""
                UPDATE customers 
                SET password_hash = %s,
                    is_active = 1,
                    email_verified = 1
                WHERE email = %s
            """, (password_hash, test_user['email']))
            connection.commit()
            print("\n✅ Пароль оновлено!")
        else:
            # Create new user
            password_hash = pwd_context.hash(test_user['password'])
            
            cursor.execute("""
                INSERT INTO customers 
                (email, password_hash, firstname, lastname, telephone, status, is_active, email_verified, created_at, synced_at)
                VALUES (%s, %s, %s, %s, %s, 1, 1, 1, NOW(), NOW())
            """, (
                test_user['email'],
                password_hash,
                test_user['firstname'],
                test_user['lastname'],
                test_user['telephone']
            ))
            connection.commit()
            print("✅ Тестовий користувач створений!")
        
        print("\n" + "=" * 60)
        print("📝 ДАНІ ДЛЯ ВХОДУ:")
        print("=" * 60)
        print(f"Email:    {test_user['email']}")
        print(f"Пароль:   {test_user['password']}")
        print("=" * 60)
    
    connection.close()
    
except Exception as e:
    print(f"❌ Помилка: {e}")
