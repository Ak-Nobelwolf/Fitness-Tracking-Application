// Test the in-memory fallback directly
const { getDefaultActivityTypesInMemory } = require('./server/dist/repositories/activityTypes.js');

const ownerId = '11111111-1111-1111-1111-111111111111';
const activityTypes = getDefaultActivityTypesInMemory(ownerId);

console.log(`Total activity types: ${activityTypes.length}`);
console.log('First 5 activity types:');
activityTypes.slice(0, 5).forEach((type, index) => {
  console.log(`${index + 1}. ${type.name} (${type.met} MET)`);
});