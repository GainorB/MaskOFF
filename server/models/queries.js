var db = require('../models/config');

/*
* GET ROUTES
*/




/*
* POST ROUTES
*/




/*
* UPDATE ROUTES
*/

// THIS FUNCTION UPDATE A USERS PROFILE
function updateProfile(req, res, next){
    let userID = parseInt(req.user.id);

    db.none('UPDATE users SET username=$1, email=$2, state=$3, city=$4, gender=$5, age=$6 WHERE id=$7', 
            [req.body.username, req.body.email, req.body.state, req.body.city, req.body.gender, req.body.age, userID])
      .then((data) => { res.status(200).json({ status: `User ${userID}'s (${req.user.username}) profile successfully updated.` }); })
      .catch((e) => { return next(e); });
}



/*
* DELETE ROUTES
*/

// THIS FUNCTION WILL DELETE A USERS PROFILE
function deleteAccount(req, res, next){
    let userID = parseInt(req.user.id);
    console.log(userID);

    db.none(`DELETE FROM users WHERE id=${userID}`)
      .then((data) => { res.status(200).json({ status: `User ${userID}'s (${req.user.username}) profile successfully deleted.` }); })
      .catch((e) => { return next(e); });
}



module.exports = {
    updateProfile, deleteAccount,
};