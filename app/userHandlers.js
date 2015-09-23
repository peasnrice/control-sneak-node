var User = require('../app/models/user');

function getUser(req, res, next){
	User.findOne({ '_id' :  req.decoded }, function(err, user) {
        if (err) { return next(err) }
        if (!user) {
          return res.json(401, { error: 'user not found' });
        }
      	return res.json(200, { success: true, message: 'Found User' });
    });
};

exports.getUser = getUser;