var db = require('../models/config');

/*
* GET ROUTES
*/

// RETURN ALL LISTINGS
function getAllListings(req, res, next){
    db.any(`SELECT * FROM listings WHERE accepted = FALSE
            ORDER BY date_created DESC`)
      .then(data => {
        res.render('Browse', { data: data, title: "Browse" })
    }).catch(e => { return next(e); });
}

// GET A SINGLE LISTING
function getAListing(id, req, res, next){
    
    let ID = parseInt(id);

    db.any(`SELECT * FROM listings WHERE id = ${ID}`)
      .then(data => {
        res.render('aListing', { data: data, title: "Listing" })
    }).catch(e => { return next(e); });
}

// GET ACCEPTED LISTINGS
function getAcceptedListings(req, res, next){

    db.any(`SELECT * FROM listings WHERE who_accepted = $1 ORDER BY date_accepted DESC`, req.user.username)
        .then(data => { 
            
            res.render('AcceptedListings', { data: data, title: "Accepted Listings" })

        }).catch(e => { return next(e); });
}

/*function getAcceptedListings(req, res, next){

    db.any(`SELECT * FROM acceptedListings WHERE who_accepted = $1 ORDER BY date_accepted DESC`, req.user.username)
        .then(data => { 
            
            res.render('AcceptedListings', { data: data, title: "Accepted Listings" })

        }).catch(e => { return next(e); });
}*/


/*
* POST ROUTES
*/

// CREATE A LISTING
function createListing(req, res, next){

    res.setHeader('Content-Type', 'application/json');

    let image2, image3, image4, image5;
    const { username, email, city, state } = req.user;
    const { category, brand, title, size, whatsize, condition, image1, ship, meetup, cash } = req.body;

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

    db.none('INSERT into listings(posted_by, state, city, email, category, brand, title, size, whatsize, condition, image1, image2, image3, image4, image5, ship, meetup, cash)'
                + 'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)', 
                [username, state, city, email, category, brand, title, size[1], whatsize[1], condition, 
                image1, image2, image3, image4, image5, ship, meetup, cash])
      .then(data => { res.redirect('/dashboard/create'); })
      .catch(e => { return next(e); });
}


// ACCEPT A LISTING
function acceptListing(id, req, res, next){
    let itemID = parseInt(id);

    db.none(`UPDATE listings
             SET accepted = true, date_accepted = now(), who_accepted = $1
             WHERE id = $2`, [req.user.username, itemID])
      .then(data => { res.redirect('/dashboard/accepted'); })
      .catch(e => { return next(e); });
}

/*function acceptListing(id, req, res, next){

    let itemID = parseInt(id);

    // 1. SELECT THE ITEM FROM THE LISTINGS TABLE
    db.any(`SELECT * FROM listings WHERE id = ${itemID}`)
      .then(data => {

            // 2. INSERT ITEM INTO ACCEPTEDLISTINGS TABLE
            db.none('INSERT into acceptedListings(who_accepted, trading_with, title, condition, state, city, email, image1, cash, ship, meetup)' +
                    'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
                    [req.user.username, data[0].posted_by, data[0].title, data[0].condition, 
                    data[0].state, data[0].city, data[0].email, data[0].image1, data[0].cash, data[0].ship, data[0].meetup])
                    .then(data => {
                         
                         // 3. DELETE FROM LISTINGS TABLE
                         db.none(`DELETE FROM listings WHERE id=$1`, itemID)
                                .then(data => {
                                      
                                      res.redirect('/dashboard/accepted');

                                }).catch(e => { return next(e); });
                    }).catch(e => { return next(e); });
      }).catch(e => { return next(e); });
}*/


/*
* UPDATE ROUTES
*/

// THIS FUNCTION UPDATE A USERS PROFILE
function updateProfile(req, res, next){
    const userID = parseInt(req.user.id);
    const { username, email, state, city, age } = req.body;

    db.none('UPDATE users SET username=$1, email=$2, state=$3, city=$4, age=$5 WHERE id=$6', 
            [username, email, state, city, age, userID])
      .then(data => { res.status(200).json({ message: "Success" }); })
      .catch(e => { return next(e); });
}


/*
* DELETE ROUTES
*/

// THIS FUNCTION WILL DELETE A USERS PROFILE
function deleteAccount(req, res, next){
    let userID = parseInt(req.user.id);

    db.none(`DELETE FROM users WHERE id=${userID}`)
      .then(data => { res.status(200).json({ message: "Success" }); })
      .catch(e => { return next(e); });
}



module.exports = {
    updateProfile, deleteAccount, createListing, getAllListings, getAListing, acceptListing, getAcceptedListings
};