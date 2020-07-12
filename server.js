const express = require('express');
const dotenv = require('dotenv');

// Routes
const bootcampRouter = require('./routes/bootcampRouter');

// Load env files
dotenv.config({ path: './config/config.env' });

const app = express();

// Mount routers
app.use('/api/v1/bootcamps', bootcampRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) });