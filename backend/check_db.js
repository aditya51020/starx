import axios from 'axios';

async function check() {
    try {
        const featured = await axios.get('http://localhost:5000/api/properties?featured=true');
        console.log('Featured count:', featured.data.data ? featured.data.data.length : 0);
        console.log('Featured data:', JSON.stringify(featured.data.data, null, 2));

        const all = await axios.get('http://localhost:5000/api/properties');
        console.log('All count:', all.data.data ? all.data.data.length : 0);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

check();
