import requests
import sys
import json
from datetime import datetime, timedelta

class FarforDecorAPITester:
    def __init__(self, base_url="https://event-organizer-19.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.user_id = None
        self.board_id = None
        self.item_id = None

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json() if response.content else {}
                    self.log_test(name, True, f"Status: {response.status_code}")
                    return True, response_data
                except:
                    self.log_test(name, True, f"Status: {response.status_code} (No JSON response)")
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json().get('detail', '')
                    if error_detail:
                        error_msg += f" - {error_detail}"
                except:
                    pass
                self.log_test(name, False, error_msg)
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_login(self):
        """Test login with provided credentials"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={"email": "test@farfordecor.com", "password": "test123456"}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            return True
        return False

    def test_get_me(self):
        """Test get current user info"""
        success, response = self.run_test("Get User Info", "GET", "auth/me", 200)
        if success and 'customer_id' in response:
            self.user_id = response['customer_id']
        return success

    def test_get_categories(self):
        """Test get categories"""
        return self.run_test("Get Categories", "GET", "categories", 200)

    def test_get_subcategories(self):
        """Test get subcategories (new endpoint)"""
        success, response = self.run_test("Get All Subcategories", "GET", "subcategories", 200)
        
        # Test with specific category
        success2, response2 = self.run_test(
            "Get Subcategories for Category", 
            "GET", 
            "subcategories?category_name=Меблі", 
            200
        )
        
        return success and success2

    def test_get_products(self):
        """Test get products with various filters"""
        # Basic products
        success1, _ = self.run_test("Get Products", "GET", "products?limit=50", 200)
        
        # With search
        success2, _ = self.run_test("Search Products", "GET", "products?search=стіл", 200)
        
        # With category filter
        success3, _ = self.run_test("Filter by Category", "GET", "products?category_id=1", 200)
        
        # With color filter
        success4, _ = self.run_test("Filter by Color", "GET", "products?color=білий", 200)
        
        return success1 and success2 and success3 and success4

    def test_create_board(self):
        """Test create event board"""
        board_data = {
            "board_name": "Test Event Board",
            "event_date": "2024-12-25",
            "event_type": "wedding",
            "rental_start_date": "2024-12-24",
            "rental_end_date": "2024-12-26",
            "notes": "Test board for API testing",
            "budget": 5000.0
        }
        
        success, response = self.run_test(
            "Create Event Board",
            "POST",
            "boards",
            201,
            data=board_data
        )
        
        if success and 'id' in response:
            self.board_id = response['id']
        
        return success

    def test_get_boards(self):
        """Test get user's boards"""
        return self.run_test("Get User Boards", "GET", "boards", 200)

    def test_get_board_details(self):
        """Test get specific board details"""
        if not self.board_id:
            self.log_test("Get Board Details", False, "No board ID available")
            return False
        
        return self.run_test("Get Board Details", "GET", f"boards/{self.board_id}", 200)

    def test_add_item_to_board(self):
        """Test add item to board"""
        if not self.board_id:
            self.log_test("Add Item to Board", False, "No board ID available")
            return False
        
        item_data = {
            "product_id": 59,  # Using actual product ID from API
            "quantity": 1,  # Using quantity that exists
            "notes": "Test item"
        }
        
        success, response = self.run_test(
            "Add Item to Board",
            "POST",
            f"boards/{self.board_id}/items",
            201,
            data=item_data
        )
        
        if success and 'id' in response:
            self.item_id = response['id']
        
        return success

    def test_update_board_item(self):
        """Test update board item quantity"""
        if not self.board_id or not self.item_id:
            self.log_test("Update Board Item", False, "No board or item ID available")
            return False
        
        update_data = {"quantity": 3}
        
        return self.run_test(
            "Update Board Item",
            "PATCH",
            f"boards/{self.board_id}/items/{self.item_id}",
            200,
            data=update_data
        )

    def test_delete_board_item(self):
        """Test delete board item (should also delete soft reservation)"""
        if not self.board_id or not self.item_id:
            self.log_test("Delete Board Item", False, "No board or item ID available")
            return False
        
        return self.run_test(
            "Delete Board Item",
            "DELETE",
            f"boards/{self.board_id}/items/{self.item_id}",
            204
        )

    def test_product_availability(self):
        """Test product availability check"""
        availability_data = {
            "product_id": 59,  # Using actual product ID
            "quantity": 1,  # Using available quantity
            "reserved_from": "2024-12-24",
            "reserved_until": "2024-12-26"
        }
        
        return self.run_test(
            "Check Product Availability",
            "POST",
            "products/check-availability",
            200,
            data=availability_data
        )

    def test_update_board(self):
        """Test update board"""
        if not self.board_id:
            self.log_test("Update Board", False, "No board ID available")
            return False
        
        update_data = {
            "board_name": "Updated Test Board",
            "budget": 6000.0
        }
        
        return self.run_test(
            "Update Board",
            "PATCH",
            f"boards/{self.board_id}",
            200,
            data=update_data
        )

    def cleanup_test_data(self):
        """Clean up test data"""
        if self.board_id:
            self.run_test(
                "Cleanup - Delete Test Board",
                "DELETE",
                f"boards/{self.board_id}",
                204
            )

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting FarforDecor API Tests")
        print("=" * 50)
        
        # Health check
        if not self.test_health_check()[0]:
            print("❌ Health check failed - stopping tests")
            return False
        
        # Authentication
        if not self.test_login():
            print("❌ Login failed - stopping tests")
            return False
        
        if not self.test_get_me():
            print("❌ Get user info failed")
        
        # Categories and products
        self.test_get_categories()
        self.test_get_subcategories()
        self.test_get_products()
        self.test_product_availability()
        
        # Board management
        if self.test_create_board():
            self.test_get_boards()
            self.test_get_board_details()
            self.test_update_board()
            
            # Item management
            if self.test_add_item_to_board():
                self.test_update_board_item()
                self.test_delete_board_item()  # This should also test soft reservation deletion
            
            # Cleanup
            self.cleanup_test_data()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

    def get_test_report(self):
        """Get detailed test report"""
        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "failed_tests": self.tests_run - self.tests_passed,
            "success_rate": (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0,
            "test_results": self.test_results
        }

def main():
    tester = FarforDecorAPITester()
    success = tester.run_all_tests()
    
    # Save detailed report
    report = tester.get_test_report()
    with open('/app/test_reports/backend_api_test_results.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())