const express = require('express');
const router = express.Router();
const { check, validationResult, matchedData } = require('express-validator');

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

require('./firebaseConfig');
const { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } = require("firebase/auth");

var loggedInUser = getAuth().currentUser;

router.get('/', async (req, res) => {
    isLoggedIn = await stateChange();

    if (isLoggedIn) {
        res.redirect('/document');
    }
    else {
        res.render('index');
    }
});

router.get('/login', csrfProtection, async (req, res) => {
    isLoggedIn = await stateChange();

    if (isLoggedIn) {
        res.redirect('/document');
    }
    else {
        res.render('login', {
            data: {},
            errors: {},
            csrfToken: req.csrfToken()
        })
    }
});

router.post('/login', [
    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .normalizeEmail(),
    check('password')
        .isLength({ min: 5 })
        .withMessage('Invalid password.')
        .bail()
        .trim()
    ], csrfProtection, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('login', {
                data: req.body,
                errors: errors.mapped(),
                csrfToken: req.csrfToken()
            });
        }

        const data = matchedData(req);
        console.log('Sanitized:', data);

        req.flash('success', `You've been logged in, welcome ${data.email}`);

        signInResponse = await login(req.body.email, req.body.password);

        console.log(signInResponse);

        if (signInResponse.isSignedIn && signInResponse.user != null) {
            res.redirect('document');
        }
        else {
            if (signInResponse.error.code == 'auth/user-not-found') {
                res.status(200).render('login', {
                    data: {},
                    errors: { user: {
                        msg: 'User does not exist',
                        code: signInResponse.error.code
                    }
                },
                    csrfToken: req.csrfToken()
                });
            }
        }
});


router.get('/document', csrfProtection, async (req, res) => {
    isLoggedIn = await stateChange();

    if (isLoggedIn) {
        res.render('document', {
            csrfToken: req.csrfToken()
        });
    }
    else {
        res.render('login', {
            data: {},
            errors: {},
            csrfToken: req.csrfToken()
        })
    }
});

router.post('/logout', async (req, res) => {
    isLoggedOut = await logOut();

    if (isLoggedOut) {
        res.redirect('/');
    }
    else {
        req.flash('danger', 'There was an issue logging you out.');
        res.render('document');
    }
});

async function login(email, password) {
    isSignedIn = false;

    signInResponse = { 
        isSignedIn: isSignedIn, 
        user: null,
        error: {
            code: '',
            message: ''
        }
    };

    await signInWithEmailAndPassword(getAuth(), email, password)
    .then((userCredential) => {
        // Signed in 
        loggedInUser = userCredential.user;
        console.log('Signed in');
        
        isSignedIn = true;

        signInResponse.user = loggedInUser;
        signInResponse.isSignedIn = true;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)

        signInResponse.error.code = errorCode;
        signInResponse.error.message = errorMessage;
    });

    return signInResponse;
}

async function stateChange() {
    isLoggedIn = false;

    await onAuthStateChanged(getAuth(), (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            const uid = user.uid;
            isLoggedIn = true;
        } else {
            // User is signed out
            console.log('User is signed out');
        }
    });

    return isLoggedIn;
}

async function logOut() {
    loggedOut = false;

    await signOut(getAuth()).then(() => {
        console.log('Successful sign out');
        loggedOut = true;
    }).catch((error) => {
        // An error happened.
        console.log('Error signing you out ¯\_(ツ)_/¯');
    });

    return loggedOut;
}

module.exports = router;