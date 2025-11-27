import pymysql
import json

# Database connection details
db_config = {
    'host': 'farforre.mysql.tools',
    'port': 3306,
    'database': 'farforre_rentalhub',
    'user': 'farforre_rentalhub',
    'password': '-nu+3Gp54L'
}

try:
    # Connect to MySQL
    connection = pymysql.connect(
        host=db_config['host'],
        port=db_config['port'],
        user=db_config['user'],
        password=db_config['password'],
        database=db_config['database'],
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    
    print("✅ Successfully connected to MySQL database!")
    print(f"📊 Database: {db_config['database']}\n")
    
    with connection.cursor() as cursor:
        # Get all tables
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        table_key = f"Tables_in_{db_config['database']}"
        table_names = [table[table_key] for table in tables]
        
        print(f"📋 Found {len(table_names)} tables:\n")
        print("=" * 80)
        
        for table_name in table_names:
            print(f"\n🗂️  TABLE: {table_name}")
            print("-" * 80)
            
            # Get table structure
            cursor.execute(f"DESCRIBE {table_name}")
            columns = cursor.fetchall()
            
            print(f"{'Column':<30} {'Type':<20} {'Null':<8} {'Key':<8} {'Default':<15}")
            print("-" * 80)
            
            for col in columns:
                print(f"{col['Field']:<30} {col['Type']:<20} {col['Null']:<8} {col['Key']:<8} {str(col['Default']):<15}")
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) as count FROM {table_name}")
            count = cursor.fetchone()['count']
            print(f"\n📊 Total rows: {count}")
            
            # Show sample data (first 3 rows)
            if count > 0:
                cursor.execute(f"SELECT * FROM {table_name} LIMIT 3")
                sample_data = cursor.fetchall()
                print(f"\n📄 Sample data (first 3 rows):")
                for idx, row in enumerate(sample_data, 1):
                    print(f"\nRow {idx}:")
                    for key, value in row.items():
                        value_str = str(value)[:100] if value else 'NULL'
                        print(f"  {key}: {value_str}")
            
            print("\n" + "=" * 80)
    
    connection.close()
    print("\n✅ Database structure analysis complete!")
    
except pymysql.Error as e:
    print(f"❌ Error connecting to MySQL: {e}")
except Exception as e:
    print(f"❌ Unexpected error: {e}")
