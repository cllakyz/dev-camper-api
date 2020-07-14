const express   = require('express');
const dotenv    = require('dotenv');
const morgan    = require('morgan');

// Routes
const bootcampRouter = require('./routes/bootcampRouter');

// Load env files
dotenv.config({ path: './config/config.env' });

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcampRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) });