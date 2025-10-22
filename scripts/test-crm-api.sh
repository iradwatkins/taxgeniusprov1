#!/bin/bash

# CRM API Functionality Tests
# Tests API endpoints for proper authentication and security

BASE_URL="https://taxgeniuspro.tax"
TEST_CONTACT_ID="cmgxquyqk0000jxa8wakm2i56"

echo "=================================================="
echo "🚀 CRM API FUNCTIONALITY TESTS"
echo "=================================================="
echo ""

PASSED=0
FAILED=0

# Test 1: Contact Details API - Should require authentication
echo "📝 Test 1: Contact Details API - Authentication Required"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/crm/contacts/$TEST_CONTACT_ID/details")

if [ "$RESPONSE" = "307" ] || [ "$RESPONSE" = "401" ]; then
    echo "   ✅ PASSED - Returns $RESPONSE (requires authentication)"
    ((PASSED++))
else
    echo "   ❌ FAILED - Returns $RESPONSE (expected 307 or 401)"
    ((FAILED++))
fi
echo ""

# Test 2: Interactions API POST - Should require authentication
echo "📝 Test 2: Interactions API POST - Authentication Required"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"contactId":"test","type":"PHONE_CALL","direction":"OUTBOUND"}' \
    "$BASE_URL/api/crm/interactions")

if [ "$RESPONSE" = "307" ] || [ "$RESPONSE" = "401" ]; then
    echo "   ✅ PASSED - Returns $RESPONSE (requires authentication)"
    ((PASSED++))
else
    echo "   ❌ FAILED - Returns $RESPONSE (expected 307 or 401)"
    ((FAILED++))
fi
echo ""

# Test 3: Interactions API GET - Should require authentication
echo "📝 Test 3: Interactions API GET - Authentication Required"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/crm/interactions?contactId=$TEST_CONTACT_ID")

if [ "$RESPONSE" = "307" ] || [ "$RESPONSE" = "401" ]; then
    echo "   ✅ PASSED - Returns $RESPONSE (requires authentication)"
    ((PASSED++))
else
    echo "   ❌ FAILED - Returns $RESPONSE (expected 307 or 401)"
    ((FAILED++))
fi
echo ""

# Test 4: Contact Detail Page - Should require authentication
echo "📝 Test 4: Contact Detail Page - Authentication Required"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/crm/contacts/$TEST_CONTACT_ID")

if [ "$RESPONSE" = "307" ] || [ "$RESPONSE" = "401" ]; then
    echo "   ✅ PASSED - Returns $RESPONSE (requires authentication)"
    ((PASSED++))
else
    echo "   ❌ FAILED - Returns $RESPONSE (expected 307 or 401)"
    ((FAILED++))
fi
echo ""

# Test 5: CRM Contacts List Page - Should require authentication
echo "📝 Test 5: CRM Contacts List Page - Authentication Required"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/crm/contacts")

if [ "$RESPONSE" = "307" ] || [ "$RESPONSE" = "401" ]; then
    echo "   ✅ PASSED - Returns $RESPONSE (requires authentication)"
    ((PASSED++))
else
    echo "   ❌ FAILED - Returns $RESPONSE (expected 307 or 401)"
    ((FAILED++))
fi
echo ""

# Test 6: Check redirect headers for proper Clerk integration
echo "📝 Test 6: Clerk Authentication Headers"
HEADERS=$(curl -s -I "$BASE_URL/api/crm/contacts/$TEST_CONTACT_ID/details" | grep -i "x-clerk")

if echo "$HEADERS" | grep -q "x-clerk-auth-status"; then
    echo "   ✅ PASSED - Clerk headers present"
    echo "   ℹ️  $HEADERS"
    ((PASSED++))
else
    echo "   ❌ FAILED - Clerk headers not found"
    ((FAILED++))
fi
echo ""

# Test 7: Verify redirect URL preservation
echo "📝 Test 7: Redirect URL Preservation"
LOCATION=$(curl -s -I "$BASE_URL/crm/contacts/$TEST_CONTACT_ID" | grep -i "^location:" | cut -d' ' -f2 | tr -d '\r')

if echo "$LOCATION" | grep -q "redirect_url"; then
    echo "   ✅ PASSED - Redirect URL preserved for post-login return"
    echo "   ℹ️  Location: $LOCATION"
    ((PASSED++))
else
    echo "   ❌ FAILED - Redirect URL not preserved"
    ((FAILED++))
fi
echo ""

# Test 8: Calendar API - Should require authentication
echo "📝 Test 8: Calendar/Appointments API - Authentication Required"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/appointments")

if [ "$RESPONSE" = "307" ] || [ "$RESPONSE" = "401" ]; then
    echo "   ✅ PASSED - Returns $RESPONSE (requires authentication)"
    ((PASSED++))
else
    echo "   ❌ FAILED - Returns $RESPONSE (expected 307 or 401)"
    ((FAILED++))
fi
echo ""

# Summary
echo "=================================================="
echo "📊 TEST RESULTS SUMMARY"
echo "=================================================="
echo ""
echo "Total Tests: $((PASSED + FAILED))"
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 All tests passed! CRM security is properly configured."
    echo ""
    exit 0
else
    echo "⚠️  Some tests failed. Review the errors above."
    echo ""
    exit 1
fi
