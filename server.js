const path          = require('path');
const express       = require('express');
const dotenv        = require('dotenv');
const morgan        = require('morgan');
const colors        = require('colors');
const fileupload    = require('express-fileupload');
const cookieParser  = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet        = require('helmet');
const xssClean      = require('xss-clean');
const rateLimit     = require('express-rate-limit');
const hpp           = require('hpp');
const cors          = require('cors');

const connectDB     = require('./config/db');
const errorHandler  = require('./app/middlewares/error');

// Load env files
dotenv.config({ path: './config/config.env' });

// Connect database
connectDB();

// Route files
const bootcampRouter = require('./app/routes/bootcamps');
const courseRouter   = require('./app/routes/courses');
const authRouter     = require('./app/routes/auth');
const userRouter     = require('./app/routes/users');
const reviewRouter   = require('./app/routes/reviews');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xssClean());

// Rate limiting
app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
}));

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => { console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold) });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});