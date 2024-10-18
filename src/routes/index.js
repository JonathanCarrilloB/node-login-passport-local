const express = require('express');
const router = express.Router();
const passport = require('passport');

// Ruta principal (home)
router.get('/', (req, res, next) => {
    res.render('index');
});

// Ruta para el registro de usuarios
router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/', // Redirige a la página principal después del registro exitoso
    failureRedirect: '/signup', // Si falla, redirige nuevamente a signup
    passReqToCallback: true
}));

// Ruta para el inicio de sesión
router.get('/signin', (req, res, next) => {
    res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile', // Si el inicio de sesión es exitoso, redirige a profile
    failureRedirect: '/signin', // Si falla, redirige nuevamente a signin
    passReqToCallback: true
}));

// Ruta para cerrar sesión
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err); // Si hay un error durante el logout, pasa al siguiente middleware
        }
        res.redirect('/'); // Redirige a la página principal tras cerrar sesión
    });
});

// Ruta protegida del perfil de usuario
router.get('/profile', isAuthenticated, (req, res, next) => {
    res.render('profile');
});

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/signin'); // Redirige a signin si no está autenticado
}

module.exports = router;
