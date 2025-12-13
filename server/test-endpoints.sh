#!/bin/bash

# Test script for DB Connection & Health Check
# Usage: ./test-endpoints.sh

set -e

# Configuration
API_URL="${API_URL:-http://localhost:3001}"
OWNER_ID="${OWNER_ID:-11111111-1111-1111-1111-111111111111}"
ACTIVITY_TYPE_ID="${ACTIVITY_TYPE_ID:-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2}"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "Testing Express API & Oracle Connection"
echo "========================================="
echo ""
echo "API URL: $API_URL"
echo "Owner ID: $OWNER_ID"
echo ""

# Test counter
PASSED=0
FAILED=0

# Helper function to test endpoint
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local headers="$4"
    local data="$5"
    local expected_status="$6"
    
    echo -n "Testing $name... "
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" $headers -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" $headers)
    fi
    
    # Extract status code (last line) and body (everything else)
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
        PASSED=$((PASSED + 1))
        if [ -n "$body" ]; then
            echo "  Response: $(echo "$body" | head -c 100)..."
        fi
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $status_code)"
        FAILED=$((FAILED + 1))
        if [ -n "$body" ]; then
            echo "  Response: $body"
        fi
    fi
    echo ""
}

# Test 1: Health Check
test_endpoint \
    "Health Check" \
    "GET" \
    "/health" \
    "" \
    "" \
    "200"

# Test 2: Activity Types (without owner ID - should fail)
test_endpoint \
    "Activity Types (no owner-id header)" \
    "GET" \
    "/api/v1/activity-types" \
    "" \
    "" \
    "400"

# Test 3: Activity Types (with owner ID)
test_endpoint \
    "Activity Types (with owner-id)" \
    "GET" \
    "/api/v1/activity-types" \
    "-H \"x-owner-id: $OWNER_ID\"" \
    "" \
    "200"

# Test 4: Create/Update Owner Profile
test_endpoint \
    "Create/Update Owner Profile" \
    "PUT" \
    "/api/v1/owners/profile" \
    "-H \"Content-Type: application/json\" -H \"x-owner-id: $OWNER_ID\"" \
    '{"displayName":"Test User","weightKg":75,"heightCm":175}' \
    "200"

# Test 5: Get Owner Profile
test_endpoint \
    "Get Owner Profile" \
    "GET" \
    "/api/v1/owners/profile" \
    "-H \"x-owner-id: $OWNER_ID\"" \
    "" \
    "200"

# Test 6: Create Activity
test_endpoint \
    "Create Activity" \
    "POST" \
    "/api/v1/activities" \
    "-H \"Content-Type: application/json\" -H \"x-owner-id: $OWNER_ID\"" \
    "{\"activityTypeId\":\"$ACTIVITY_TYPE_ID\",\"startTime\":\"2024-01-15T10:00:00Z\",\"endTime\":\"2024-01-15T11:00:00Z\",\"durationMinutes\":60,\"notes\":\"Test activity\"}" \
    "201"

# Test 7: Get Activities
test_endpoint \
    "Get Activities" \
    "GET" \
    "/api/v1/activities" \
    "-H \"x-owner-id: $OWNER_ID\"" \
    "" \
    "200"

# Test 8: Dashboard Daily Stats
test_endpoint \
    "Dashboard Daily Stats" \
    "GET" \
    "/api/v1/dashboard/daily" \
    "-H \"x-owner-id: $OWNER_ID\"" \
    "" \
    "200"

# Test 9: Full Dashboard
test_endpoint \
    "Full Dashboard" \
    "GET" \
    "/api/v1/dashboard" \
    "-H \"x-owner-id: $OWNER_ID\"" \
    "" \
    "200"

# Summary
echo "========================================="
echo "Test Summary"
echo "========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
