const mongoose = require('mongoose'); // Importa Mongoose para manejar conexiones a MongoDB
const { mongodb } = require('./keys'); // Importa la configuración de la base de datos desde el archivo keys.js

// Conecta a la base de datos MongoDB utilizando la URI proporcionada
mongoose.connect(mongodb.URI, { useNewUrlParser: true }) 
    .then(db => console.log('Database is connected')) // Si la conexión es exitosa, muestra un mensaje en consola
    .catch(err => console.log(err)); // Si hay un error al conectar, lo muestra en consola
