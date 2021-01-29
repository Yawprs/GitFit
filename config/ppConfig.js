const passport = require('passport')
const db = require('../models')
const LocalStrategy = require('passport-local')

// ----- SERIALIZATION SET UP ------

// tell passport to serialize the user using 
// the id by passing it into the done callBack
passport.serializeUser((user, doneCallback) => {
    console.log('serializing the user...')
    //check that everything is legit
    doneCallback(null, user.id)
})

// tells passport how to deserialize the user now by looking it up in
// the database based on the id (which was stored in the session)
passport.deserializeUser((id, doneCallback) => {
    db.user.findByPk(id)
    .then(foundUser => {
        console.log('deserializing user...')
        doneCallback(null, foundUser)
    })
    .catch(err => {
        console.log('error deserializing user')
    })
})

// ----- STRATEGY SET UP -----------

const findAndLogInUser = (email, password, doneCallback) => {
    // tell passport how to check that our user is legit
    db.user.findOne({where:{email: email}})
    .then(foundUser => {
        if(foundUser) {
            //check that the password is legit
            match = foundUser.validPassword(password)
        }
        if(!foundUser || !match) { //there is something funky about user
            console.log('password was NOT validated i.e. match is false')
            return doneCallback(null, foundUser)
        } else { //user was legit
            return doneCallback(null, foundUser)
        }
    })
    .catch(err => doneCallback(err))
}

// - think of doneCallback as a function that looks like this:
// login(error, userToBeLoggedIn) {
    //do stuff
// }

// we provide 'null' if there is no error, or 'false' is theres no user or,
// the password is invalid (like they did in passport local docs)

const fieldsToCheck = {
    usernameField: 'email',
    passwordField: 'password'
}
//creating an instance of local strategy
// constructor arg 1
// an object that indicates how we are going to refer to the two fields
//we're checking (ex. using email instead of username)
// arg 2 : callback that is ready to receive the two fields we're checking,
// as well as a doneCallback
const strategy = new LocalStrategy(fieldsToCheck, findAndLogInUser)
passport.use(strategy)

module.exports = passport