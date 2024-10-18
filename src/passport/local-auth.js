// Importa las bibliotecas necesarias
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user'); // Modelo de usuario

// Serializa al usuario para almacenar en la sesión
passport.serializeUser((user, done) => {
    done(null, user.id); // Almacena el ID del usuario en la sesión
});

// Deserializa al usuario desde la sesión
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id); // Busca al usuario por ID
    done(null, user); // Almacena el usuario en `req.user`
});

// Configuración de la estrategia de registro
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email', // Campo que se usará como nombre de usuario
    passwordField: 'password', // Campo que se usará como contraseña
    passReqToCallback: true // Pasa la solicitud al callback
}, async (req, email, password, done) => {

    // Busca si el usuario ya existe
    const user = await User.findOne({ email: email });
    if (user) {
        // Si ya existe, devuelve un mensaje de error
        return done(null, false, req.flash('signupMessage', 'El correo electrónico ya está registrado.'));
    } else {
        // Crea un nuevo usuario si no existe
        const newUser = new User();
        newUser.email = email; // Asigna el email
        newUser.password = newUser.encryptPassword(password); // Encripta la contraseña
        console.log(newUser); // Muestra el nuevo usuario en la consola para verificar
        await newUser.save(); // Guarda el nuevo usuario en la base de datos
        done(null, newUser); // Devuelve el nuevo usuario
    }
}));

// Configuración de la estrategia de inicio de sesión
passport.use('local-signin', new LocalStrategy({
    usernameField: 'email', // Campo que se usará como nombre de usuario
    passwordField: 'password', // Campo que se usará como contraseña
    passReqToCallback: true // Pasa la solicitud al callback
}, async (req, email, password, done) => {

    // Busca al usuario por email
    const user = await User.findOne({ email: email });
    if (!user) {
        // Si no se encuentra al usuario, devuelve un mensaje de error
        return done(null, false, req.flash('signinMessage', 'No se ha encontrado ningún usuario con este Email.'));
    }
    // Compara la contraseña ingresada con la almacenada
    if (!user.comparePassword(password)) {
        // Si la contraseña es incorrecta, devuelve un mensaje de error
        return done(null, false, req.flash('signinMessage', 'Contraseña Incorrecta.'));
    }
    // Si todo está bien, devuelve al usuario
    return done(null, user);
}));
