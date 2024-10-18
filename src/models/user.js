const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
    password: String
});

// Método para cifrar la contraseña
userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Método para comparar la contraseña
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password); 
};

module.exports = mongoose.model('user', userSchema);
