module.exports.setFlash = function (req, res, next) { // Export a middleware function named 'setFlash'
    res.locals.flash = { // Set the 'flash' property on 'res.locals'
      success: req.flash('success'), // Assign the value of 'req.flash('success')' to the 'success' property
      error: req.flash('error'), // Assign the value of 'req.flash('error')' to the 'error' property
    };
  
    next(); // Call the 'next()' function to pass control to the next middleware
  };