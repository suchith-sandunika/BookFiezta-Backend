const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
const AuthRoute = require('./routes/AuthRoute');
const BookRoute = require('./routes/BookRoute');
const CommonRoute = require('./routes/CommonRoute');
const UserRoute = require('./routes/UserRoute');
const SessionRoute = require('./routes/SessionRoute');
const AdminRoute = require('./routes/AdminRoute');
const OptionsRoute = require('./routes/OptionsRoute');

// Declare app ...
const app = express();

// Declare the variables for env variables ...
const port = process.env.PORT || 8000;
const mongo_url = process.env.MONGODB_URL;

// Establish the database connection ...
mongoose.connect(mongo_url)
 .then(() => console.log('Connected to MongoDB'))
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

// Declare the routes ...
app.use('/api/', BookRoute);
app.use('/api/auth/', AuthRoute);
app.use('/api/', UserRoute);
app.use('/api/', CommonRoute);
app.use('/api/session/', SessionRoute);
app.use('/api/admin/auth/', AdminRoute);
app.use('/api/', OptionsRoute);

// Declare the app running state ...
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});