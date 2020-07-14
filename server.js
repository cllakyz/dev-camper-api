const express   = require('express');
const connectDB = require('./config/db');
const dotenv    = require('dotenv');
const morgan    = require('morgan');

// Load env files
dotenv.config({ path: './config/config.env' });

// Connect database
connectDB();

// Routes
const bootcampRouter = require('./app/routes/bootcampRouter');


const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcampRouter);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => { console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});