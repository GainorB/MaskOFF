var db = require('../models/config');

/*
* GET ROUTES
*/




/*
* POST ROUTES
*/

// CREATE A LISTING
function createListing(req, res, next){

    res.setHeader('Content-Type', 'application/json');

    let image2, image3, image4, image5;

    // IF THESE IMAGES ARE LEFT OUT
    if(req.body.image2 === undefined){
        image2 = "http://via.placeholder.com/400x400";
    } else {
        image2 = req.body.image2;
    }

    if(req.body.image3 === undefined) {
        image3 = "http://via.placeholder.com/400x400";
    } else {
        image3 = req.body.image3;
    }

    if(req.body.image4 === undefined) {
        image4 = "http://via.placeholder.com/400x400";
    } else {
        image4 = req.body.image4;
    }

    if(req.body.image5 === undefined) {
        image5 = "http://via.placeholder.com/400x400";
    } else {
        image5 = req.body.image5;
    }

    db.none('INSERT into listings(belongs_to, category, brand, title, size, condition, image1, image2, image3, image4, image5, ship, meetup, cash)'
                + 'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', 
                [req.user.username, req.body.category, req.body.brand, req.body.title, req.body.size, req.body.condition, 
                req.body.image1, image2, image3, image4, image5, req.body.ship,
                req.body.meetup, req.body.cash])
      .then((data) => { res.redirect('/dashboard/create'); })
      .catch((err) => { return next(err); });
}



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
    updateProfile, deleteAccount, createListing
};