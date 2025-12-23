// Simple test to verify activity types fallback works
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/v1/activity-types',
  method: 'GET',
  headers: {
    'x-owner-id': '11111111-1111-1111-1111-111111111111',
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(`Activity types count: ${parsed.activityTypes ? parsed.activityTypes.length : 0}`);
      if (parsed.activityTypes && parsed.activityTypes.length > 0) {
        console.log('First activity type:', parsed.activityTypes[0].name);
      }
    } catch (e) {
      console.log('Response data:', data);
    }
  });
});

req.on('error', (e) => {
  console.log(`Request error: ${e.message}`);
});

req.end();