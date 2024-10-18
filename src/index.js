const express = require('express'); // Importa Express para manejar el servidor
const engine = require('ejs-mate'); // Importa EJS-Mate para usar EJS como motor de plantillas
const path = require('path'); // Importa el módulo path para manejar rutas de archivos
const morgan = require('morgan'); // Importa Morgan para registrar las solicitudes HTTP
const passport = require('passport'); // Importa Passport para manejar la autenticación
const session = require('express-session'); // Importa express-session para manejar sesiones
const flash = require('connect-flash'); // Importa connect-flash para mostrar mensajes de notificación

// Inicializaciones
const app = express(); // Crea una instancia de la aplicación Express
require('./database'); // Importa la configuración de la base de datos
require('./passport/local-auth'); // Importa la configuración de autenticación local de Passport

// Configuraciones
app.set('views', path.join(__dirname, 'views')); // Establece el directorio de vistas
app.engine('ejs', engine); // Establece EJS como motor de plantillas
app.set('view engine', 'ejs'); // Configura el motor de plantillas a usar
app.set('port', process.env.PORT || 3000); // Establece el puerto del servidor (3000 por defecto)

// Middleware
app.use(morgan('dev')); // Usa Morgan para registrar solicitudes en desarrollo
app.use(express.urlencoded({ extended: false })); // Middleware para parsear datos de formularios
app.use(session({ // Configuración de la sesión
    secret: 'myscretsession', // Clave secreta para la sesión
    resave: false, // No guardar sesión si no ha sido modificada
    saveUninitialized: false // No guardar sesiones no inicializadas
}));
app.use(flash()); // Usa connect-flash para mensajes temporales
app.use(passport.initialize()); // Inicializa Passport para la autenticación
app.use(passport.session()); // Configura Passport para manejar sesiones

// Middleware para mensajes y usuario
app.use((req, res, next) => {
   app.locals.signupMessage = req.flash('signupMessage'); // Mensajes de registro
   app.locals.signinMessage = req.flash('signinMessage'); // Mensajes de inicio de sesión
   app.locals.user = req.user; // Usuario autenticado
   next(); // Pasa al siguiente middleware
});

// Rutas
app.use('/', require('./routes/index')); // Configura las rutas del archivo index.js

// Iniciar el servidor
app.listen(app.get('port'), () => { // Inicia el servidor en el puerto configurado
    console.log('Server on port', app.get('port')); // Mensaje en consola confirmando que el servidor está corriendo
});
