#!/bin/bash

# Script to replace super_admin references with admin
# This makes admin and super_admin the same role

echo "🔄 Replacing super_admin references with admin..."
echo "=================================================="

# Find all TypeScript/JavaScript files and replace
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i "s/role === 'super_admin'/role === 'admin'/g" {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i 's/role === "super_admin"/role === "admin"/g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i "s/role !== 'super_admin'/role !== 'admin'/g" {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i 's/role !== "super_admin"/role !== "admin"/g' {} +

# Replace in comments and strings (informational only)
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i "s/super_admin/admin/g" {} +

echo "✅ Replacement complete!"
echo ""
echo "Note: This script replaced:"
echo "  - role === 'super_admin' → role === 'admin'"
echo "  - role !== 'super_admin' → role !== 'admin'"
echo "  - All other 'super_admin' references → 'admin'"
echo ""
echo "Files in src/ have been updated."
