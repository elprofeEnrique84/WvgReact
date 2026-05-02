#!/bin/bash

# WVG API Test Script

API_URL="http://localhost:3001/api"
EMAIL="egonzalez@consultoragrupodxas.com"
PASSWORD="123456"

echo "🧪 Testing WVG API REST"
echo "================================"
echo ""

# Test health
echo "1️⃣  Health Check..."
curl -s "$API_URL/health" | jq .
echo ""

# Test login
echo "2️⃣  Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "$LOGIN_RESPONSE" | jq .
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo "Token: $TOKEN"
echo ""

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  exit 1
fi

# Test get me
echo "3️⃣  Testing GET /auth/me..."
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/auth/me" | jq .
echo ""

# Test mantenimientos
echo "4️⃣  Testing GET /mantenimientos..."
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/mantenimientos" | jq '.data | length' && echo "mantenimientos found"
echo ""

# Test catalogos
echo "5️⃣  Testing GET /catalogos/equipos..."
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/catalogos/equipos" | jq '.data | length' && echo "equipos found"
echo ""

echo "✅ Test complete!"
