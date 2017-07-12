var db = require('../models/config');

/*
* HELPER FUNCTIONS
*/

/*
* CAPITALIZES THE FIRST LETTER OF EVERY WORD IN A STRING
*/
function capitalizeFirstLetter(string){
    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};


/*
* GET ROUTES
*/

/*
* RESPONSIBLE FOR FILTERING PER CATEGORY AND BRAND
* CATEGORY AND BRAND COMES FROM THE FORM SUBMISSION THROUGH THE ROUTE
*/
function filterCategory(category, brand, req, res, next){

    db.tx(t => {

            return t.batch([
                // TOTAL LISTINGS IN DATABASE PER BRAND/CATEGORY
                t.any('SELECT COUNT(*) AS filter_stats FROM listings WHERE accepted = false AND completed = false AND category = $1 AND brand = $2', [category, brand]),
                // FILTER PER BRAND/CATEGORY
                t.any(`SELECT listings.title, COALESCE(to_char(date_created, 'Dy Mon DD at HH12:MI:SSam'), '') AS date_created, listings.brand, listings.size, listings.whatsize, listings.category, listings.condition, listings.cash, users.city, users.state, users.username, images.image1 FROM listings
                       INNER JOIN images ON listings.id = images.id 
                       INNER JOIN users ON listings.userid = users.userid 
                       WHERE accepted = FALSE AND category = $1 AND brand = $2 ORDER BY listings.date_created DESC`, [category, brand]),
                // TOTAL LISTINGS IN DATABASE
                t.any('SELECT COUNT(*) AS browse_stats FROM listings WHERE completed = FALSE AND accepted = FALSE'),
            ]);
        })
        .then(data => {

            // FILTER OUT DUPLICATE BRAND NAMES SO THE DROP DOWN ONLY SHOWS THE BRAND NAME ONCE
            let brands = data[1].map((item) => { return item.brand })
                                .filter((item, index, arr) => { return arr.indexOf(item) === index; });

            // FILTER OUT DUPLICATE CATEGORY NAMES SO THE DROP DOWN ONLY SHOWS THE CATEGORY NAME ONCE
            let categories = data[1].map((item) => { return item.category })
                                    .filter((item, index, arr) => { return arr.indexOf(item) === index; });

            // FILTERED DATA
            let trades = data[1];

            // TOTAL NUMBER OF LISTINGS PER BRAND/CATEGORY
            let filterStats = data[0][0].filter_stats;

            // TOTAL NUMBER OF LISTINGS
            let browseStats = data[2][0].browse_stats;

            res.render('Browse', { 
                title: `Browsing`, 
                query: '', 
                trades, category, brand, brands, browseStats, filterStats, categories });

        }).catch(e => { console.log(e); });
}

/*
* GET ALL TRADES FROM DATABASE
*/
function getAllListings(req, res, next){

    db.tx(t => {

            return t.batch([
                // TOTAL TRADES IN DATABASE
                t.any('SELECT COUNT(*) AS browse_stats FROM listings WHERE completed = FALSE AND accepted = FALSE'),
                // SELECT ALL TRADES
                t.any(`SELECT listings.title, listings.id, COALESCE(to_char(date_created, 'Dy Mon DD at HH12:MI:SSam'), '') AS date_created, listings.brand, listings.category, listings.size, listings.whatsize, listings.condition, listings.cash, users.city, users.state, users.username, images.image1 FROM listings
                       INNER JOIN images ON listings.id = images.id 
                       INNER JOIN users ON listings.userid = users.userid 
                       WHERE accepted = FALSE AND completed = FALSE ORDER BY listings.date_created DESC`),
            ]);
        })
        .then(data => {

            // FILTER OUT DUPLICATE BRAND NAMES SO THE DROP DOWN ONLY SHOWS THE BRAND NAME ONCE
            let brands = data[1].map((item) => { return item.brand })
                                .filter((item, index, arr) => { return arr.indexOf(item) === index; });

            // FILTER OUT DUPLICATE CATEGORY NAMES SO THE DROP DOWN ONLY SHOWS THE CATEGORY NAME ONCE
            let categories = data[1].map((item) => { return item.category })
                                    .filter((item, index, arr) => { return arr.indexOf(item) === index; });

            // TOTAL NUMBER OF TRADES
            let browseStats = data[0][0].browse_stats;

            // ALL TRADES
            let trades = data[1];

            res.render('Browse', { 
                title: "Browse", 
                category: '', 
                brand: '', 
                query: '',
                filterStats: 0, 
                browseStats, trades, brands, categories });

        }).catch(e => { console.log(e); });
}

/*
* GET A SINGLE TRADE FROM THE DATABASE
*/
function getAListing(id, req, res, next){
    
    let ID = parseInt(id);

    // GRAB A SINGLE TRADE BY ID
    db.any(`SELECT listings.title, listings.id, COALESCE(to_char(date_created, 'Dy Mon DD at HH12:MI:SSam'), '') AS date_created, listings.brand, listings.size, 
            listings.whatsize, listings.condition, listings.cash, users.city, users.state, listings.ship, listings.meetup,
            users.username, images.image1, images.image2, images.image3, images.image4, images.image5 FROM listings
            INNER JOIN images ON listings.id = images.id 
            INNER JOIN users ON listings.userid = users.userid 
            WHERE accepted = FALSE AND completed = FALSE AND listings.id = ${ID} ORDER BY listings.date_created DESC`)
      .then(data => {
        res.render('SingleTrade', { title: "Listing", data })
    }).catch(e => { console.log(e); });
}

/*
* GET ALL ACCEPTED TRADES FOR THE USER THAT IS LOGGED IN
*/
function getAcceptedListings(req, res, next){

    // GRAB ALL TRADES BY LOGGED IN USERS USERNAME
    db.any(`SELECT listings.title, listings.completed, listings.id, listings.who_accepted, COALESCE(to_char(date_created, 'Dy Mon DD at HH12:MI:SSam'), '') AS date_created, COALESCE(to_char(date_accepted, 'Dy Mon DD at HH12:MI:SSam'), '') AS date_accepted, listings.brand, listings.size, 
            listings.whatsize, listings.condition, listings.ship, listings.meetup, listings.cash, users.city, users.state, 
            users.username, users.email, images.image1 FROM listings
            INNER JOIN images ON listings.id = images.id 
            INNER JOIN users ON listings.userid = users.userid 
            WHERE listings.who_accepted = $1 ORDER BY listings.date_accepted DESC`, req.user.username)
        .then(data => { 
            res.render('AcceptedTrades', { title: "My Trades", data })
        }).catch(e => { console.log(e); });
}

/*
* GET MY STATS
* RENDERS THE TOTAL STATS IN THE DASHBOARD
*/
function getMyStats(req, res, next){
    const { userid, username } = req.user;

    db.tx(t => {

            return t.batch([
                // TOTAL NUMBER OF TRADES
                t.any(`SELECT COUNT(*) AS total_listings FROM listings WHERE userid = ${userid}`),
                // TOTAL NUMBER OF ACTIVE TRADES
                t.any(`SELECT COUNT(*) AS active_listings FROM listings WHERE userid = ${userid} AND accepted = false AND completed = false`),
                // TOTAL NUMBER OF COMPLETED TRADES
                t.any(`SELECT COUNT(*) AS total_completed FROM listings WHERE who_accepted = $1 AND completed = true`, username),
                // TOTAL NUMBER OF ACCEPTED TRADES
                t.any(`SELECT COUNT(*) AS total_accepted FROM listings WHERE who_accepted = $1 AND accepted = true`, username)
            ]);
        })
        .then(data => {

            // STORE DATA IN VARIABLES BEFORE PASSING TO VIEW
            let total = data[0][0].total_listings;
            let active = data[1][0].active_listings;
            let completed = data[2][0].total_completed;
            let accepted = data[3][0].total_accepted;

            res.render('Dashboard', { total, active, completed, accepted, title: `${username}'s Profile` });
        })
        .catch(e => { console.log(e); });
}

/*
* SEARCH THE DATABASE FOR A TRADE
*/
function searchDatabase(query, req, res, next){

    db.tx(t => {

            return t.batch([
                // SEARCH RESULTS
                t.any(`SELECT listings.title, listings.id, COALESCE(to_char(date_created, 'Dy Mon DD at HH12:MI:SSam'), '') AS date_created, listings.brand, listings.size, 
                       listings.whatsize, listings.condition, listings.category, listings.cash, users.city, users.state, 
                       users.username, images.image1 FROM listings
                       INNER JOIN images ON listings.id = images.id 
                       INNER JOIN users ON listings.userid = users.userid 
                       WHERE listings.title ILIKE '%${query}%' AND accepted = FALSE AND completed = FALSE ORDER BY listings.date_created DESC`),
                // TOTAL NUMBER OF SEARCH RESULTS
                t.any(`SELECT COUNT(*) AS search_stats FROM listings WHERE title ILIKE '%${query}%' AND accepted = FALSE AND completed = FALSE`),
                // TOTAL NUMBER OF TRADES
                t.any('SELECT COUNT(*) AS browse_stats FROM listings WHERE completed = FALSE AND accepted = FALSE'),
            ]);
        })
        .then(data => {

            // FILTER OUT DUPLICATE BRAND NAMES SO THE DROP DOWN ONLY SHOWS THE BRAND NAME ONCE
            let brands = data[0].map((item) => { return item.brand })
                                .filter((item, index, arr) => { return arr.indexOf(item) === index; });

            // FILTER OUT DUPLICATE CATEGORY NAMES SO THE DROP DOWN ONLY SHOWS THE CATEGORY NAME ONCE
            let categories = data[0].map((item) => { return item.category })
                                    .filter((item, index, arr) => { return arr.indexOf(item) === index; });

            // CONTAINS ALL TRADES
            let trades = data[0];

            // TOTAL NUMBER OF SEARCH RESULTS
            let searchStats = data[1][0].search_stats;

            // TOTAL NUMBER OF BROWSE STATS
            let browseStats = data[2][0].browse_stats;

            res.render('Browse', { 
              title: `Browsing`, 
              category: '', 
              brand: '',
              trades, query, brands, searchStats, browseStats, categories })
        })
        .catch(e => { console.log(e); });
}

/*
* GET MY LISTINGS TO SHARE MY PROFILE
*/
function getMyListings (username, req, res, next){
    db.tx(t => {

            return t.batch([
                // SELECT ALL ACTIVE TRADES USING USERNAME
                t.any(`SELECT listings.title, listings.id, COALESCE(to_char(date_created, 'Dy Mon DD at HH12:MI:SSam'), '') AS date_created, listings.brand, listings.size, 
                       listings.whatsize, listings.condition, listings.cash, users.city, users.state, 
                       users.username, images.image1 FROM listings
                       INNER JOIN images ON listings.id = images.id 
                       INNER JOIN users ON listings.userid = users.userid 
                       WHERE users.username = '${username}'
                       AND completed = FALSE AND accepted = FALSE`),
                
                // RETURNS USERNAME
                t.any(`SELECT users.username FROM users WHERE users.username = '${username}'`),
            ]);
        })
        .then(data => {

            // IF DATA[1][0] IS UNDEFINED THE USER DOESN'T EXIST
            if(data[1][0] === undefined){
                req.flash('error', `User doesn't exist. Browse other trades below.`);
                res.redirect('/browse');
            } else {
                req.flash('info', `You're viewing ${data[0][0].username}'s trades, you'll need an account to see more information or to accept a trade.`);
                res.render('ViewMyTrades', { title: `${data[0][0].username}'s Trades`, data: data[0] });
            }
        })
        .catch(e => { console.log(e); });

}


/*
* POST ROUTES
*/

/*
* CREATE A LISTING
*/
function createListing(req, res, next){

    let image2, image3, image4, image5;
    const { userid, username, email, city, state } = req.user;
    const { category, brand, title, size, whatsize, condition, image1, ship, meetup, cash } = req.body;

    // IF THE USER DOESN'T INCLUDE THESE IMAGES
    // THE DATABASE DOESN'T ALLOW NULL VALUES
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

    db.one('INSERT INTO listings(userid, category, brand, title, size, whatsize, condition, ship, meetup, cash)' 
         + 'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id', 
           [userid, category, capitalizeFirstLetter(brand), capitalizeFirstLetter(title), size[1], whatsize[1], condition, ship, meetup, cash])
      .then(data => {

          // INSERT IMAGES AFTER LISTINGS IS INSERTED SINCE THE ID IS NEEDED BECAUSE OF THE FOREIGN KEY CONSTRAINT
          db.one('INSERT INTO images(id, image1, image2, image3, image4, image5)' 
               + 'VALUES($1, $2, $3, $4, $5, $6)',
                 [data.id, image1, image2, image3, image4, image5])
            .catch(e => { console.log(e); });

            req.flash('success', 'Your item has successfully been created.');
            res.redirect('/dashboard/create'); 

        })
        .catch(e => { 
            if(e.column !== undefined){
                req.flash('error', `${capitalizeFirstLetter(e.column)} is missing, please make sure you selected a Category and Sizes.`);
                res.redirect('/dashboard/create'); 
            } 

            console.log(e); 
        });
}


/*
* ACCEPT A TRADE
*/
function acceptListing(id, req, res, next){

    let itemID = parseInt(id);

    db.any(`SELECT listings.title, listings.completed, listings.id, listings.who_accepted, COALESCE(to_char(date_created, 'Dy Mon DD at HH12:MI:SSam'), '') AS date_created, listings.brand, listings.size, 
            listings.whatsize, listings.condition, listings.cash, users.city, users.state, 
            users.username, users.email, images.image1 FROM listings
            INNER JOIN images ON listings.id = images.id 
            INNER JOIN users ON listings.userid = users.userid 
            WHERE listings.id = ${itemID}`)
        .then(data => { 

        // CANT ACCEPT YOUR OWN TRADE
        if(data[0].username === req.user.username){

            req.flash('error', `You can't accept a trade you posted.`);
            res.redirect('/browse');

        } else {
            
            req.flash('success', 'You successfully accepted a trade.');
            db.none(`UPDATE listings
                     SET accepted = TRUE, date_accepted = now(), who_accepted = $1
                     WHERE id = $2`, [req.user.username, itemID])
              .then(data => { res.redirect('/dashboard/trades'); })
              .catch(e => { console.log(e); });
        }})
        .catch(e => { console.log(e); });
}


/*
* UPDATE ROUTES
*/

// THIS FUNCTION UPDATE A USERS PROFILE
function updateProfile(req, res, next){

    const userID = parseInt(req.user.userid);
    const { username, email, state, city } = req.body;

    db.any('SELECT who_accepted FROM listings')
        .then(data => {

            let who = data.map(e => { return e.who_accepted });

            if(who.includes(req.user.username)){

                db.none('UPDATE listings SET who_accepted = $1', username)
                    .then(data => {

                        db.none('UPDATE users SET username = $1, email = $2, state = $3, city = $4 WHERE userid = $5', 
                        [username, email, capitalizeFirstLetter(state), capitalizeFirstLetter(city), userID])
                        .catch(e => { console.log(e); });

                    }).catch(e => { console.log(e); });

            } else {

                db.none('UPDATE users SET username = $1, email = $2, state = $3, city = $4 WHERE userid = $5', 
                [username, email, capitalizeFirstLetter(state), capitalizeFirstLetter(city), userID])
                .catch(e => { console.log(e); });

            }

        }).catch(e => { console.log(e); });
}


// THIS FUNCTION WILL CANCEL A TRADE
function cancelTrade(id, req, res, next){
    let itemID = parseInt(id);

    db.none(`UPDATE listings SET accepted = FALSE, completed = FALSE, who_accepted = 'empty' WHERE id = ${itemID}`)
      .then(data => {

          req.flash('info', `Thanks for cancelling your trade. Make sure you let the other user know.`); 
          res.redirect('/dashboard/trades'); 

        })
      .catch(e => { console.log(e); });
}

// THIS FUNCTION WILL COMPLETE A TRADE
function completedTrade(id, req, res, next){
    let itemID = parseInt(id);

    db.none(`UPDATE listings SET completed = true, accepted = false WHERE id = ${itemID}`)
      .then(data => {

          req.flash('info', `Thanks for completing your trade. Hope it went well.`); 
          res.redirect('/dashboard/trades'); 

        })
      .catch(e => { console.log(e); });
}


/*
* DELETE ROUTES
*/

// THIS FUNCTION WILL DELETE A USERS PROFILE
function deleteAccount(req, res, next){

    const { userid, username } = req.user;

    db.any(`SELECT id FROM listings WHERE userid = $1`, userid)
        .then(data => {

            let deleteThese = data.map(e => { return e.id; });

            if(deleteThese.length !== 0){

                db.none(`DELETE FROM images WHERE id IN ($1)`, deleteThese.join())
                    .then(data => {

                            db.none(`DELETE FROM listings WHERE userid = $1`, userid)
                            .then(data => {
                                    
                                    db.none(`DELETE FROM users WHERE userid = $1`, userid)
                                    .then(data => { 

                                            db.none(`UPDATE listings SET accepted = FALSE, who_accepted = 'empty' WHERE who_accepted = $1`, username)
                                            .then(data => {

                                                    req.flash('info', 'Account Deleted');
                                                    res.redirect('/');

                                            }).catch(e => { console.log(e); });
                                        }).catch(e => { console.log(e); });
                            }).catch(e => { console.log(e); });
                    }).catch(e => { console.log(e); });

            } else {

                db.none(`DELETE FROM listings WHERE userid = $1`, userid)
                    .then(data => {
                        
                        db.none(`DELETE FROM users WHERE userid = $1`, userid)
                            .then(data => { 

                                db.none(`UPDATE listings SET accepted = FALSE, who_accepted = 'empty' WHERE who_accepted = $1`, username)
                                    .then(data => {

                                        req.flash('info', 'Account Deleted');
                                        res.redirect('/');

                                    }).catch(e => { console.log(e); });
                            }).catch(e => { console.log(e); });
                    }).catch(e => { console.log(e); });
            }

        }).catch(e => { console.log(e); });
}


// DELETE A LISTING
function deleteListing(id, req, res, next){
    let itemID = parseInt(id);

    db.tx(t => {

            return t.batch([
                // DELETE ROW FROM IMAGES TABLE
                t.any(`DELETE FROM images WHERE id = ${itemID}`),
                // DELETE ROW FROM LISTINGS TABLE
                t.any(`DELETE FROM listings WHERE id = ${itemID}`)
            ]);
        })
      .then(data => { 

            req.flash('info', `Your trade has been deleted.`); 
            res.redirect('/browse'); 
       })
      .catch(e => { console.log(e); });
}


module.exports = {
    updateProfile,
    deleteAccount,
    createListing,
    getAllListings,
    getAListing,
    acceptListing,
    getAcceptedListings,
    cancelTrade,
    completedTrade,
    filterCategory,
    deleteListing,
    getMyStats,
    searchDatabase,
    getMyListings
};