import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

conn = pymysql.connect(
    host=os.getenv('RH_DB_HOST'),
    port=int(os.getenv('RH_DB_PORT', 3306)),
    user=os.getenv('RH_DB_USERNAME'),
    password=os.getenv('RH_DB_PASSWORD'),
    database=os.getenv('RH_DB_DATABASE')
)

try:
    cursor = conn.cursor()
    
    # Read and execute migration
    with open('/app/backend/migrations/create_orders_table.sql', 'r') as f:
        sql = f.read()
    
    cursor.execute(sql)
    conn.commit()
    
    print("✅ Migration applied successfully!")
    print("✅ Table 'orders' created")
    
    cursor.close()
except Exception as e:
    print(f"❌ Migration failed: {e}")
finally:
    conn.close()
