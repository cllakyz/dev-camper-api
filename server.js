const express       = require('express');
const dotenv        = require('dotenv');
const morgan        = require('morgan');
const colors        = require('colors');
const connectDB     = require('./config/db');
const errorHandler  = require('./app/middlewares/error');

// Load env files
dotenv.config({ path: './config/config.env' });

// Connect database
connectDB();

// Routes
const bootcampRouter = require('./app/routes/bootcampRouter');


const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcampRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => { console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold) });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});