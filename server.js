const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const path = require('path');

const AuthRoute = require('./routes/AuthRoute');
const BookRoute = require('./routes/BookRoute');
const EmailRoute = require('./routes/EmailRoute');
const UserRoute = require('./routes/UserRoute');
const SessionRoute = require('./routes/SessionRoute');
const AdminRoute = require('./routes/AdminRoute');
const OptionsRoute = require('./routes/OptionsRoute');
const PaymentRoute = require('./routes/PaymentRoute');
const { router, frontendURL } = require('./routes/CaptureFrontendURLRoute');

// Declare app ...
const app = express();

// Declare the variables for env variables ...
const port = process.env.PORT || 8000;
const mongo_url = process.env.MONGODB_URL;

// Establish the database connection ...
mongoose.connect(mongo_url)
 .then(() => console.log(`Connected to MongoDB Database on ${mongo_url}`))
 .catch((error) => console.error('Failed to connect to MongoDB', error));

// Middleware setup ...
app.use(cookieParser());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Declare additional usages ... 
app.use(express.json());
app.use(cors()); 

// app.use(express.static('uploads'));
// Serve files from the 'uploads' directory ...
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true })); // or false if you want to use the querystring library ...

// Express Session ...
// app.use(session({
//     secret: process.env.SESSION_SECRET,  // Change this to a strong secret
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false, // Set to true in production (HTTPS)
//         maxAge: 30 * 60 * 1000  // Session expires in 30 minutes (30 mins * 60 sec * 1000 ms)
//     }
// }));

// Declare the routes ...
app.use('/api/', BookRoute);
app.use('/api/auth/', AuthRoute);
app.use('/api/', UserRoute);
app.use('/api/', EmailRoute);
app.use('/api/session/', SessionRoute);
app.use('/api/admin/auth/', AdminRoute);
app.use('/api/', OptionsRoute);
app.use('/api/cart/', PaymentRoute);
app.use('/api/', router);

// Declare the app running state ...
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    if(frontendURL != '') {
        console.log(`Relevant Client is running on ${frontendURL}`);
        return;
    }
});