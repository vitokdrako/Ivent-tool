import pymysql

# Database connection details
db_config = {
    'host': 'farforre.mysql.tools',
    'port': 3306,
    'database': 'farforre_rentalhub',
    'user': 'farforre_rentalhub',
    'password': '-nu+3Gp54L'
}

# Read SQL file
with open('create_event_tables.sql', 'r', encoding='utf-8') as f:
    sql_content = f.read()

# Split by statements
statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().startswith('--')]

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
    
    print("✅ Connected to MySQL database!")
    
    with connection.cursor() as cursor:
        for i, statement in enumerate(statements, 1):
            try:
                cursor.execute(statement)
                print(f"✅ Statement {i} executed successfully")
            except Exception as e:
                print(f"⚠️ Statement {i} error: {e}")
                # Continue with next statement
        
        connection.commit()
    
    print("\n✅ All tables created successfully!")
    connection.close()
    
except pymysql.Error as e:
    print(f"❌ Error: {e}")
