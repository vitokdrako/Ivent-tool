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

# Ваш користувач
user_email = 'vitokdrako@gmail.com'
user_password = 'test123'

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
        cursor.execute("SELECT * FROM customers WHERE email = %s", (user_email,))
        user = cursor.fetchone()
        
        if user:
            print(f"✅ Користувач знайдений!")
            print(f"ID: {user['customer_id']}")
            print(f"Ім'я: {user['firstname']} {user['lastname']}")
            print(f"Email: {user['email']}")
            print()
            
            # Update password
            password_hash = pwd_context.hash(user_password)
            cursor.execute("""
                UPDATE customers 
                SET password_hash = %s,
                    is_active = 1,
                    email_verified = 1
                WHERE email = %s
            """, (password_hash, user_email))
            connection.commit()
            
            print("=" * 60)
            print("✅ ПАРОЛЬ ВСТАНОВЛЕНО!")
            print("=" * 60)
            print(f"Email:    {user_email}")
            print(f"Пароль:   {user_password}")
            print("=" * 60)
            print("\n🎉 Тепер можете входити на сайт!")
        else:
            print(f"❌ Користувач {user_email} не знайдений в базі")
    
    connection.close()
    
except Exception as e:
    print(f"❌ Помилка: {e}")
