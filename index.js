require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./router/route');

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
