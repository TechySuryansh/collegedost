const axios = require('axios');

(async () => {
    try {
        const res = await axios.post('http://localhost:5001/api/exams/ingest');
        console.log(JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error("Error:");
        if (err.response) {
            console.error(JSON.stringify(err.response.data, null, 2));
        } else {
            console.error(err.message);
        }
    }
})();
