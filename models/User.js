const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  Nombre: {
     type: String, 
     required: true, 
    },
  Apellido: {
     type: String, 
     required: true, 
    },
  nombreUsuario: {
     type: String, 
     required: true, 
     unique: true 
    },
  Password:
   {
     type: String, 
     required: true 
    },
  Correo:
   {
     type: String, 
     required: true ,
     unique: true 
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
