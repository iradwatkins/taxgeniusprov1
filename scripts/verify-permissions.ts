/**
 * Verify Permissions System
 *
 * Tests that role normalization works correctly for both
 * database format (SUPER_ADMIN) and TypeScript format (super_admin)
 */

import { getUserPermissions } from '../src/lib/permissions';

console.log('🔐 Testing Permissions System - Role Normalization\n');
console.log('='.repeat(60));

// Test cases with both uppercase (database) and lowercase (TypeScript) formats
const testCases = [
  { role: 'SUPER_ADMIN', expectedAddressBook: true, expectedCalendar: true },
  { role: 'super_admin', expectedAddressBook: true, expectedCalendar: true },
  { role: 'ADMIN', expectedAddressBook: true, expectedCalendar: true },
  { role: 'admin', expectedAddressBook: true, expectedCalendar: true },
  { role: 'TAX_PREPARER', expectedAddressBook: true, expectedCalendar: true },
  { role: 'tax_preparer', expectedAddressBook: true, expectedCalendar: true },
  { role: 'AFFILIATE', expectedAddressBook: false, expectedCalendar: false },
  { role: 'affiliate', expectedAddressBook: false, expectedCalendar: false },
  { role: 'CLIENT', expectedAddressBook: false, expectedCalendar: false },
  { role: 'client', expectedAddressBook: false, expectedCalendar: false },
  { role: 'LEAD', expectedAddressBook: false, expectedCalendar: false },
  { role: 'lead', expectedAddressBook: false, expectedCalendar: false },
];

let passed = 0;
let failed = 0;

testCases.forEach((testCase) => {
  const permissions = getUserPermissions(testCase.role);

  // Treat undefined as false for permission checks
  const addressBookValue = permissions.addressBook || false;
  const calendarValue = permissions.calendar || false;

  const addressBookMatch = addressBookValue === testCase.expectedAddressBook;
  const calendarMatch = calendarValue === testCase.expectedCalendar;
  const success = addressBookMatch && calendarMatch;

  if (success) {
    console.log(
      `✅ ${testCase.role.padEnd(15)} - addressBook: ${permissions.addressBook}, calendar: ${permissions.calendar}`
    );
    passed++;
  } else {
    console.log(`❌ ${testCase.role.padEnd(15)} - FAILED`);
    console.log(
      `   Expected: addressBook=${testCase.expectedAddressBook}, calendar=${testCase.expectedCalendar}`
    );
    console.log(
      `   Got:      addressBook=${permissions.addressBook}, calendar=${permissions.calendar}`
    );
    failed++;
  }
});

console.log('='.repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests\n`);

if (failed === 0) {
  console.log('🎉 All tests passed! Role normalization working correctly.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please check the permissions system.\n');
  process.exit(1);
}
