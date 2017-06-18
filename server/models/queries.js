var db = require('../models/config');

/*
* GET ROUTES
*/

// FILTER CATEGORIES
function filterCategory(category, brand, req, res, next){
    db.any('SELECT * FROM listings WHERE accepted = FALSE AND category = $1 AND brand = $2 ORDER BY date_created DESC', [category, brand])
      .then(data => {

        // FILTER OUT DUPLICATE BRAND NAMES SO THE DROP DOWN ONLY SHOWS ONE BRAND 
        let brands = data.map(function(item) { return item.brand }).filter((item, index, arr) => { return arr.indexOf(item) === index; });
        res.render('Browse', { title: `Browsing`, data, category, brand, brands })

      }).catch(e => { console.log(e); });
}

// RETURN ALL LISTINGS
function getAllListings(req, res, next){
    db.any(`SELECT * FROM listings WHERE accepted = FALSE
            ORDER BY date_created DESC`)
      .then(data => {
        
        // FILTER OUT DUPLICATE BRAND NAMES SO THE DROP DOWN ONLY SHOWS ONE BRAND
        let brands = data.map(function(item) { return item.brand }).filter((item, index, arr) => { return arr.indexOf(item) === index; });
        res.render('Browse', { title: "Browse", category: '', brand: '', brands, data })

    }).catch(e => { console.log(e); });
}

// GET A SINGLE LISTING
function getAListing(id, req, res, next){
    
    let ID = parseInt(id);

    db.any(`SELECT * FROM listings WHERE id = ${ID}`)
      .then(data => {
        res.render('SingleTrade', { title: "Listing", data })
    }).catch(e => { console.log(e); });
}

// GET ACCEPTED LISTINGS
function getAcceptedListings(req, res, next){

    db.any(`SELECT * FROM listings WHERE who_accepted = $1 AND accepted = true ORDER BY date_accepted DESC`, req.user.username)
        .then(data => { 
            
            res.render('AcceptedTrades', { title: "My Trades", data })

        }).catch(e => { console.log(e); });
}


/*
* POST ROUTES
*/

function capitalizeFirstLetter(string){
    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// CREATE A LISTING
function createListing(req, res, next){

    console.log(req.body.uploadedImage);

    //res.setHeader('Content-Type', 'application/json');

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
                [username, state, city, email, category, capitalizeFirstLetter(brand), title, size[1], whatsize[1], condition, 
                image1, image2, image3, image4, image5, ship, meetup, cash])
      .then(data => { res.redirect('/dashboard/create'); })
      .catch(e => { console.log(e); });
}


// ACCEPT A LISTING
function acceptListing(id, req, res, next){

    let itemID = parseInt(id);

    db.any(`SELECT * FROM listings WHERE id = $1`, itemID)
        .then(data => { 

        if(data[0].posted_by === req.user.username){

            req.flash('error', `You can't accept a trade you posted.`);
            res.redirect('/browse');

        } else {
            
            req.flash('success', 'You successfully accepted a trade.');
            db.none(`UPDATE listings
                     SET accepted = true, date_accepted = current_date, who_accepted = $1
                     WHERE id = $2`, [req.user.username, itemID])
              .then(data => { res.redirect('/dashboard/trades'); })
              .catch(e => { console.log(e); });
        }}).catch(e => { console.log(e); });
}


/*
* UPDATE ROUTES
*/

// THIS FUNCTION UPDATE A USERS PROFILE
function updateProfile(req, res, next){

    const userID = parseInt(req.user.id);
    const { username, email, state, city} = req.body;

    // 1. CHECK LISTINGS TO SEE IF THIS USER HAS A LISTING
    db.any('SELECT posted_by FROM listings')
      .then(data => {

          // 2. IF USER HAS A POST IN LISTINGS TABLE
          if(data[0].posted_by === req.user.username){

            // 3. UPDATE LISTINGS TABLE WITH THE USERS NEW PROFILE INFORMATION
            db.any('UPDATE listings SET posted_by=$1, email=$2, state=$3, city=$4 WHERE posted_by=$5', [username, email, state, city, req.user.username])
              .then(() =>{ 

                    // 4. THEN UPDATE THE USERS TABLE WITH THE USERS PROFILE INFORMATION
                    db.none('UPDATE users SET username=$1, email=$2, state=$3, city=$4 WHERE id=$5', [username, email, state, city, userID])
                      .catch(e => { console.log(e); });

                }).catch(e => { console.log(e); });

          } else {

            db.none('UPDATE users SET username=$1, email=$2, state=$3, city=$4 WHERE id=$5', [username, email, state, city, userID])
              .catch(e => { console.log(e); });

          }
      }).catch(e => { console.log(e); });
}


// THIS FUNCTION WILL CANCEL A TRADE
function cancelTrade(id, req, res, next){
    let itemID = parseInt(id);

    db.none(`UPDATE listings SET accepted = false WHERE id = ${itemID}`)
      .then(data => {

          req.flash('success', `Thanks for cancelling your trade. Make sure to let the other user know.`); 
          res.redirect('/dashboard/trades'); 

        })
      .catch(e => { console.log(e); });
}

// THIS FUNCTION WILL COMPLETE A TRADE
function completedTrade(id, req, res, next){
    let itemID = parseInt(id);

    db.none(`UPDATE listings SET completed = true WHERE id = ${itemID}`)
      .then(data => {

          req.flash('success', `Thanks for completing your trade. Hope it went well.`); 
          res.redirect('/dashboard/trades'); 

        })
      .catch(e => { console.log(e); });
}


/*
* DELETE ROUTES
*/

// THIS FUNCTION WILL DELETE A USERS PROFILE
function deleteAccount(req, res, next){

    const { id, username } = req.user;

    // 1. CHECK LISTINGS TO SEE IF THIS USER HAS A LISTING
    db.any('SELECT posted_by FROM listings')
      .then(data => {

          // 2. IF USER HAS A POST IN LISTINGS TABLE
          if(data[0].posted_by === username){

                // 3. DELETE USERS LISTINGS
                db.none(`DELETE FROM listings WHERE posted_by = $1`, username)
                  .then(data => { 
                
                        // 4. DELETE FROM USERS TABLE
                        db.none(`DELETE FROM users WHERE id = $1`, id)
                        .then(data => { res.status(200).json({ message: "Success" }); })
                        .catch(e => { console.log(e); });

                   }).catch(e => { console.log(e); });            

          } else {

                db.none(`DELETE FROM users WHERE id = $1`, id)
                .then(data => { res.status(200).json({ message: "Success" }); })
                .catch(e => { console.log(e); });
          }

      }).catch(e => { console.log(e); });
}

// DELETE A LISTING
function deleteListing(id, req, res, next){
    let itemID = parseInt(id);

    db.none(`DELETE FROM listings WHERE id = ${itemID}`)
      .then(data => { 

            req.flash('success', `Thanks for deleting your trade. You should post another.`); 
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
    deleteListing 
};