const assert = require('assert');
const { add } = require('./index');

try {
  assert.strictEqual(add(2, 3), 5);
  console.log('✅ Test Passed: 2 + 3 = 5');
} catch (error) {
  console.error('❌ Test Failed:', error);
  process.exit(1);
}
