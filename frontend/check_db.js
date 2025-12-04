import axios from 'axios';

async function check() {
    try {
        const all = await axios.get('http://localhost:5000/api/properties');
        console.log('All properties:', JSON.stringify(all.data.data, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
    }
}

check();
