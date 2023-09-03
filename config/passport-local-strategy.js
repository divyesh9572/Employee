const passport = require('passport'); // Import the passport module
const LocalStrategy = require('passport-local').Strategy; // Import the LocalStrategy from passport-local
const User = require('../models/user_model'); // Import the User model

// Authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Specify the username field as 'email'
      passReqToCallback: true, // Allow passing the 'req' object as the first argument to the callback
    },
  async  function (req, email, password, done) {
      // Callback function for local authentication strategy
      // Find a user and establish the identity
      try {
        const user =await  User.findOne({ email: email });
         // Match the password
         const isPasswordCorrect = await user?.isValidatedPassword(password);

         if (!isPasswordCorrect) {
           req.flash('error', 'Invalid username or password'); // Set flash message indicating invalid credentials
           return done(null, false); // Call 'done' function with 'false' to indicate authentication failure
         }
 
         return done(null, user); // Call 'done' function with 'null' as the error and the authenticated user object
       
        if (!user) {
            req.flash('error', 'Invalid username or password'); // Set flash message indicating invalid credentials
            return done(null, false); // Call 'done' function with 'false' to indicate authentication failure

          }
      } catch (error) {
        if (error) {
            req.flash('error', error); // Set flash message with the error
            return done(error); // Call 'done' function with the error
      }
      }
  
    })
);

// Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id); // Serialize the user's ID to be stored in the session
});

// Deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log('Error in finding user ---> Passport'); // Log an error if there's an issue finding the user
      return done(err); // Call 'done' function with the error
    }

    return done(null, user); // Call 'done' function with 'null' as the error and the deserialized user object
  });
});

// Check if user authenticated (middleware)
passport.checkAuthentication = function (req, res, next) {
  console.log('inside check authentication: ', req);
  // If the user is signed in, pass on the request to the next function (controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // If the user is not signed in, redirect to the root URL
  return res.redirect('/');
};

// Set authenticated user (middleware)
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // If the user is authenticated, set the 'user' property on 'res.locals' to the current user
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport; // Export the passport configuration