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
new_user = {
    'email': 'vitokdrako@gmail.com',
    'password': 'test123',
    'firstname': 'Вита',
    'lastname': 'Филимонихина',
    'telephone': '+38(073)402-53-32'
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
        # Create new user
        password_hash = pwd_context.hash(new_user['password'])
        
        cursor.execute("""
            INSERT INTO customers 
            (email, password_hash, firstname, lastname, telephone, status, is_active, email_verified, created_at, synced_at)
            VALUES (%s, %s, %s, %s, %s, 1, 1, 1, NOW(), NOW())
        """, (
            new_user['email'],
            password_hash,
            new_user['firstname'],
            new_user['lastname'],
            new_user['telephone']
        ))
        connection.commit()
        
        print("=" * 60)
        print("✅ ВАШ АКАУНТ СТВОРЕНО!")
        print("=" * 60)
        print(f"Email:    {new_user['email']}")
        print(f"Пароль:   {new_user['password']}")
        print(f"Ім'я:     {new_user['firstname']} {new_user['lastname']}")
        print("=" * 60)
        print("\n🎉 Тепер можете входити на сайт!")
        print("📍 Відкрийте у браузері та натисніть 'Вхід'")
    
    connection.close()
    
except Exception as e:
    print(f"❌ Помилка: {e}")
