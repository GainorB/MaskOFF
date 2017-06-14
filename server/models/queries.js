var db = require('../models/config');

/*
* GET ROUTES
*/

// RETURN ALL LISTINGS
function getAllListings(req, res, next){
    db.any('SELECT * FROM listings')
      .then(function(data){
        res.render('Browse', { data: data, title: "Browse" })
    }).catch(function(e) { return next(e); });
}

// GET A SINGLE LISTING
function getAListing(id, req, res, next){
    
    let ID = parseInt(id);

    db.any(`SELECT * FROM listings WHERE id = ${ID}`)
      .then(function(data){
        res.render('aListing', { data: data, title: "data.title" })
    }).catch(function(e) { return next(e); });
}



/*
* POST ROUTES
*/

// CREATE A LISTING
function createListing(req, res, next){

    res.setHeader('Content-Type', 'application/json');

    let image2, image3, image4, image5;
    let { category, brand, title, size, whatsize, condition, image1, ship, meetup, cash } = req.body;

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

    db.none('INSERT into listings(posted_by, state, city, category, brand, title, size, whatsize, condition, image1, image2, image3, image4, image5, ship, meetup, cash)'
                + 'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)', 
                [req.user.username, req.user.state, req.user.city, category, brand, title, size[1], whatsize[1], condition, 
                image1, image2, image3, image4, image5, ship,
                meetup, cash])
      .then((data) => { res.redirect('/dashboard/create'); })
      .catch((err) => { return next(err); });
}



/*
* UPDATE ROUTES
*/

// THIS FUNCTION UPDATE A USERS PROFILE
function updateProfile(req, res, next){
    let userID = parseInt(req.user.id);

    let { username, email, state, city, gender, age } = req.body;

    db.none('UPDATE users SET username=$1, email=$2, state=$3, city=$4, gender=$5, age=$6 WHERE id=$7', 
            [username, email, state, city, gender, age, userID])
      .then((data) => { res.status(200).json({ message: "Success" }); })
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
      .then((data) => { res.status(200).json({ message: "Success" }); })
      .catch((e) => { return next(e); });
}



module.exports = {
    updateProfile, deleteAccount, createListing, getAllListings, getAListing
};