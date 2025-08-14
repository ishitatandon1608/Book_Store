#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Testing Bookstore Admin API Endpoints${NC}"
echo "=========================================="

# Base URL
BASE_URL="http://localhost:5000"

# Test 1: Health Check
echo -e "\n${YELLOW}1. Testing Health Check${NC}"
curl -s "$BASE_URL/health" | jq '.'

# Test 2: Login
echo -e "\n${YELLOW}2. Testing Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bookstore.com","password":"admin123"}')

echo "$LOGIN_RESPONSE" | jq '.'

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')

if [ "$TOKEN" = "null" ] || [ "$TOKEN" = "" ]; then
    echo -e "${RED}❌ Login failed. Cannot proceed with other tests.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Login successful. Token extracted.${NC}"

# Test 3: Get Profile
echo -e "\n${YELLOW}3. Testing Get Profile${NC}"
curl -s -X GET "$BASE_URL/api/auth/profile" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 4: Get All Books
echo -e "\n${YELLOW}4. Testing Get All Books${NC}"
curl -s -X GET "$BASE_URL/api/books" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 5: Get Books with Search
echo -e "\n${YELLOW}5. Testing Get Books with Search${NC}"
curl -s -X GET "$BASE_URL/api/books?search=gatsby" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 6: Get Low Stock Books
echo -e "\n${YELLOW}6. Testing Get Low Stock Books${NC}"
curl -s -X GET "$BASE_URL/api/books/low-stock" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 7: Get All Categories
echo -e "\n${YELLOW}7. Testing Get All Categories${NC}"
curl -s -X GET "$BASE_URL/api/categories" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 8: Get Simple Categories
echo -e "\n${YELLOW}8. Testing Get Simple Categories${NC}"
curl -s -X GET "$BASE_URL/api/categories/simple" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 9: Get Categories with Book Count
echo -e "\n${YELLOW}9. Testing Get Categories with Book Count${NC}"
curl -s -X GET "$BASE_URL/api/categories/with-count" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Test 10: Create New Category
echo -e "\n${YELLOW}10. Testing Create New Category${NC}"
curl -s -X POST "$BASE_URL/api/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Category",
    "description": "A test category for API testing"
  }' | jq '.'

# Test 11: Create New Book
echo -e "\n${YELLOW}11. Testing Create New Book${NC}"
curl -s -X POST "$BASE_URL/api/books" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "API Test Book",
    "author": "Test Author",
    "isbn": "9789999999999",
    "price": 29.99,
    "quantity": 100,
    "category_id": 1,
    "description": "A test book created via API"
  }' | jq '.'

echo -e "\n${GREEN}✅ All endpoint tests completed!${NC}"
echo -e "${BLUE}📊 Check the responses above to verify each endpoint is working correctly.${NC}" 