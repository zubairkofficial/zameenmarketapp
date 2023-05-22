const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
// const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files


const users = require('./routes/users');
const society = require('./routes/society');
const sliders = require('./routes/sliders');
const projects = require('./routes/projects');
const propertytype = require('./routes/propertytypes');
const ad = require('./routes/ads');
const adminusers = require('./routes/adminusers');
const auth = require('./routes/auth');
const purchase = require('./routes/purchase');
const bank = require('./routes/bank');
const payment = require('./routes/payments');
const mobileapi = require('./routes/mobileapi');
const dashboard = require('./routes/dashboard');
const bankdetail = require('./routes/bankdetail');

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
app.use(fileupload({
    createParentPath: true
}));

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
// const limiter = rateLimit({
//     windowMs: 10 * 60 * 1000, // 10 mins
//     max: 100
// });
// app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers

app.get('/', (req, res) => {
    res.send('Welcome to Zameen Market API')
})
app.use('/api/v1/users', users);
app.use('/api/v1/society', society);
app.use('/api/v1/sliders', sliders);
app.use('/api/v1/project', projects);
app.use('/api/v1/propertytype', propertytype);
app.use('/api/v1/ad', ad);
app.use('/api/v1/adminusers', adminusers);
app.use('/api/v1/auth', auth);
app.use('/api/v1/purchase', purchase);
app.use('/api/v1/bank', bank);
app.use('/api/v1/payment', payment);
app.use('/api/v1/mobileapi', mobileapi);
app.use('/api/v1/dashboard', dashboard);
app.use('/api/v1/bankdetail', bankdetail);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    // server.close(() => process.exit(1));
});
