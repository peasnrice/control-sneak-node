// app/routes.js

var userHandlers = require("./userHandlers.js");

module.exports = function(app, passport, jwt) {


	app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info){
            if (err) { return next(err) }
            
            if (!user) {
              return res.json(401, { error: 'user with username already exists' });
            }
            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Account Created!',
            });

        })(req, res, next);
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info){
            if (err) { return next(err) }
            
            if (!user) {
              return res.json(401, { error: 'user not found' });
            }

            // user has authenticated correctly thus we create a JWT token 
            var token = jwt.sign(user.id, app.get('superSecret'), {
              expiresInMinutes: 1440 // expires in 24 hours
            });

            console.log(token);

            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Local Token Issued!',
              token: token
            });

        })(req, res, next);
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/logout'
        }));

    app.post('/auth/facebook/token', function(req, res, next) {
      passport.authenticate('facebook-token', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
          return res.json(401, { error: 'user not found' });
        }

        var token = jwt.sign(user.id, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Facebook token issued!',
          token: token
        });

      })(req, res, next);
    });

    // route middleware to verify a token
    app.use(function(req, res, next) {

      // check header or url parameters or post parameters for token
      var token = req.headers['x-access-token'];

      // decode token
      if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded; 
            next();
          }
        });

      } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
        
      }
    });

    app.get('/test', function(req, res, next){
        userHandlers.getUser(req, res);
    });

};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.send("go home, you're drunk");
}