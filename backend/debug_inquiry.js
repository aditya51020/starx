
import http from 'http';

const data = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    message: 'Test message',
    propertyId: '5'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/inquiries',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log('Body:', body);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
