const express = require('express');
const router = express.Router();
const { sendFeedback } = require('../controllers/FeedBackSending');
const User = require('../model/User');
const upload = require('../controllers/FileUploading');
const SessionLog = require('../model/SessionLog');
const Book = require('../model/Book');
const { generateRatingPoints } = require('../utils/PointSystem');

// Route to send mails though contact us ...
router.post('/send-feedback', async (req, res) => {
    try {
        const { email, name, message } = req.body;
        // Email the admin using the provided email, name, and message...
        sendFeedback(email, name, message);
        res.status(200).json({ message: 'Feedback sent successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}); 

// Get All the users in the system ...
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        if(users.length == 0) {
            res.status(404).send('No users found');
        } else {
            res.status(200).json(users);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}); 

// Get a user by id ...
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            res.status(404).send('User not found');
        } else {
            res.status(200).json({message: "User Found", data: user});
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get a user by name ...
router.get('/users/searchByName/:name', async (req, res) => {
    try {
        // find the user datails related to the name ...
        const user = await User.findOne({name: req.params.name});
        if(!user) {
            res.status(404).send('User not found');
        } else {
            res.status(200).json({message: "User Found", data: user});
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}); 

// Get a user by email ...
router.get('/users/searchByEmail/:email', async (req, res) => {
    try {
        // find the user datails related to the name ...
        const user = await User.findOne({email: req.params.email});
        if(!user) {
            res.status(404).send('User not found');
        } else {
            res.status(200).json({message: "User Found", data: user});
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}); 

// Route to update the user profile data ...
// router.put('/user/profile/update/:name', async (req, res) => {
//     try {
//         const oldUserName = req.params.name;
//         const {newUserName, userEmail} = req.body;
//         // update the user profile data ...
//         const updatedUser = await User.findOneAndUpdate({ name: oldUserName }, // Find user by old name
//             { $set: { name: newUserName, email: userEmail } }, // Update fields
//             { new: true, runValidators: true } // Return updated document & enforce validation
//         ).lean();
//         res.status(200).json({ message: "User data updated successfully", data: updatedUser })
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// }); 

// Route to update the user profile data ... (With Image)
router.put('/user/profile/update/:name', upload.single('image'), async (req, res) => {
    try {
        const oldUserName = req.params.name;
        const {newUserName, userEmail} = req.body;
        console.log(oldUserName);
        console.log(req.body);
        console.log(req.file);
        // Declare the image path ...
        const imagePath = req.file ? req.file.path : null;
        console.log(imagePath);
        // Declare the image name ...
        const imageName = req.file ? req.file.filename : null;
        console.log(imageName);

        // get the user details related to oldUserName ...
        const userData = await User.findOne({ name: oldUserName });
        // console.log(userData.image.name, userData.image.path);
        if(userData.image !== null) {
            // Condition one ... already exists an image ... now adding another image to change the image ...
            if(req.file) {
                // update the user profile data ...
                var updatedUser = await User.findOneAndUpdate({ name: oldUserName }, // Find user by old name
                    { $set: { name: newUserName, email: userEmail, image: {path: imagePath, name: imageName} }}, // Update fields
                    { new: true, runValidators: true } // Return updated document & enforce validation ...
                ).lean();
            } else {
                // Condition two ... already exists an image ... not adding another image to change the image ...
                // update the user profile data ... without image ...
                var updatedUser = await User.findOneAndUpdate({ name: oldUserName }, // Find user by old name
                    { $set: { name: newUserName, email: userEmail }}, // Update fields
                    { new: true, runValidators: true } // Return updated document & enforce validation ...
                ).lean();
            }
        } else {
            // Condition three ... no existing image ... now adding another image to change the image ...
            // update the user profile data ...
            var updatedUser = await User.findOneAndUpdate({ name: oldUserName }, // Find user by old name
                { $set: { name: newUserName, email: userEmail, image: imagePath ? {path: imagePath, name: imageName} : {path: null, name: null} } }, // Update fields
                { new: true, runValidators: true } // Return updated document & enforce validation ...
            ).lean();
        } 

        // Update session data ...
        if(updatedUser) {
            // update session data related to the user ...
            // Find the last session related to oldUserName ...
            const lastSession = await SessionLog.findOne({ email: userEmail }).sort({ _id: -1 }).lean();
            if(lastSession) {
                // Update the session data to newUserName ...
                // Update the session with the new user name ...
                await SessionLog.updateOne({ _id: lastSession._id }, { $set: { email: userEmail } });
                res.status(200).json({ message: "User data updated successfully", data: updatedUser });
            } else {
                res.status(404).send('Error occurred while updating session data');
            }
        } else {
            res.status(404).send('Error occurred while updating user data');
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
});

// Route to delete the User Profile ...
router.delete('/user/profile/delete/:name', async (req, res) => {
    try {
        const userName = req.params.name;
        // delete the user ...
        const deletedUser = await User.findOneAndDelete({ name: userName });
        res.status(200).json({ message: "User deleted successfully", data: deletedUser })
    } catch (error) {
        res.status(500).send(error.message);
    }
}); 

// Route to add a book to the cart ...
router.post('/user/book/addtocart', async (req, res) => {
    try {
        const { userEmail, bookName } = req.body;
        // Fetch the user data ...
        const userData = await User.findOne({ email: userEmail });
        const bookData = await Book.findOne({ name: bookName });

        // Update the cart data ...
        userData.cart.push({ image: { path: bookData.image.path, name: bookData.image.name }, name: bookName, price: bookData.price, publishers: bookData.publishers });
        await userData.save();
        res.status(200).json({message: 'Book added to cart successfully', data: userData});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
}); 

// Route to rate a book ...
router.post('/user/book/rateBook', async (req, res) => {
    try {
        const { userEmail, bookName, bookPublisher } = req.body;
        // Fetch the book data ...
        const bookData = await Book.findOne({ name: bookName, publishers: bookPublisher });
        // Fetch the user data ...
        const userData = await User.findOne({ email: userEmail });
        // Get the rating for the book ...
        const updatedRating = generateRatingPoints(bookData.rating);
        console.log("New Rating:", updatedRating);
        // Update the book data ...
        await Book.updateOne({ _id: bookData._id }, { $set: { rating: updatedRating } });
        // Add the rated book to user data ...
        userData.ratedBooks.push({name: bookName, publishers: bookPublisher});
        await userData.save();
        res.status(200).json({message: 'Book rated successfully', data: bookData});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
}); 

router.post('/user/book/addreview', async (req, res) => {
    try {
        const { userEmail, bookName, reviewBody } = req.body;
        // Fetch the user details ...
        const userData = await User.findOne({ email: userEmail });
        // Fetch the book data ...
        const bookData = await Book.findOne({ name: bookName});
        // Update the review data ...
        bookData.reviews.push({userName: userData.name, reviewBody: reviewBody });
        await bookData.save();
        res.status(200).json({message: 'Review added successfully', data: bookData});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
});

// Route to get the user cart details ...
router.get('/user/cart/:name', async (req, res) => {
   try {
       const name = req.params.name;
       // get the relavant user details ...
       const user = await User.findOne({name: name}).select('_id cart');
       if(!user) {
           res.status(404).send("User not found");
       } else {
           if(user.cart.length == 0) {
               res.status(204).json({message: "User cart is empty"});
           } else {
               res.status(200).json({message: "User found", id: user._id, data: user.cart});
           }
       }
   } catch (error) {
       res.status(500).send(error.message);
       console.log(error.message);
   }
});

//Route to remove a book from user cart - This is a kind of update ... so patch / put can be used ...
router.patch('/user/cart/remove/book', async (req, res) => {
   try {
       const {bookId, userId} = req.body;
       // Find the user cart related to the userId and update the cart ...
       const updatedCart = await User.findOneAndUpdate(
           { _id: userId },  // Find the user by name ...
           { $pull: { cart: { _id: bookId } } },  // Remove item from cart array ...
           { new: true }  // Return the updated document ...
       );
       if(!updatedCart) {
           res.status(404).send('Error occured');
       } else {
           res.status(200).json({message: 'Cart updated successfully', data: updatedCart});
       }
   } catch (error) {
       res.status(500).send(error.message);
       console.log(error.message);
   }
});

router.put('/user/update/dob/age', async (req, res) => {
    try {
        const {userName, dob, age} = req.body;
        // Find user details related to the user and update data ...
        const user = await User.findOneAndUpdate({name: userName}, {dateOfBirth: dob, age: age}, {new: true});
        console.log(user);
        if(!user) {
            res.status(404).send('User Not Found');
        } else {
            res.status(200).json({message: 'User Details Updated Successfully', data: user});
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
})

module.exports = router;