var User = require('../app/models/user');

function getUser(req, res, next){
	User.findOne({ '_id' :  req.decoded }, function(err, user) {
        if (err) { return next(err) }
        if (!user) {
          return res.json(401, { error: 'user not found' });
        }
      	console.log("success");
    });
};

exports.getUser = getUser;