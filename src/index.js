const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const routes = require('./routes');

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
