const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');
const EnviarCorreo=require('../otros/mail')
const path = require('path');
 
router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send('Usuario registrado');
  } catch (error) {
    console.error('Error registrando usuario:', error);
        res.status(400).send('Error registrando usuario');
  }
});
 
//LOGIN hace match con usuario y contraseña
router.post('/login', async (req, res) => {
  const { nombreUsuario, Password } = req.body;
  console.log(nombreUsuario,Password);
  try {
    const user = await User.findOne({ nombreUsuario:nombreUsuario, Password:Password });
    console.log(user);
    if (!user) {
      return res.status(401).send('Credenciales inválidas');
    }
    const token = jwt.sign({ id: user._id, username: user.nombreUsuario }, process.env.SECRET_KEY, { expiresIn: '10s' });
     res.json({ token });
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});
 
router.put('/restablecer', async (req, res) => {
  const { correo, contresena } = req.body;
  console.log(req.body)
  try {
    const user = await User.findOne({correo})
    console.log(user)
    if(!user){
      return res.status(401).send('Usuario no existe');
    }
    user.contresena = contresena || user.contresena
    user.save()
    res.status(201).send('cambio exisitoso');
  } catch (error) {
    res.status(400).send('error en cambiar');
  }
});
 


//pide cambio de contraseña
router.post('/forgot-password', async (req, res) => {
  const { Correo } = req.body;
  try {
    const user = await User.findOne({ Correo });
    if (!user) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }
    const token = jwt.sign({ id: user._id, username: user.nombreUsuario }, process.env.SECRET_KEY, { expiresIn: '15m' });
    EnviarCorreo(Correo,"cambio de contraseña",`Ignorar si no has realizado ninguna accion`,user.nombreUsuario, token)

    res.json({ msg: 'se ha enviado correo' ,token:token});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('error');
  }
});
//pagina para cambiar contraseña
router.get('/reset-password/:token', (req, res) => {
  const token = req.params.token;
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    let uri='/home/mj99lopez/Escritorio/tareaJWT';
    return res.sendFile(path.join(uri, 'public', 'reset-password.html'));
  } catch (error) {
    console.log('Error al verificar el token:', error); // Log para ver el error
    return res.status(400).send('Token inválido o expirado');
  }
});
//pagina secreta
router.get('/login/:token',(req, res) => {
  const token=req.params.token
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    let uri='/home/mj99lopez/Escritorio/tareaJWT';
    return res.sendFile(path.join(uri, 'public', 'paginaSecreta.html'));
  } catch (error) {
    console.log('Error al verificar el token:', error); // Log para ver el error
    return res.status(400).send('Token inválido o expirado');
  }
});


//cambia la contraseña con el jwt
router.put('/reset-password/:token', verifyToken,async (req, res) => {
  const { token } = req.params;
  const { Password } = req.body;
  try {
    const user = await User.findOne({nombreUsuario: req.user.username });
    if (!user) return res.status(400).json({ mensaje: 'Invalid token' });

    user.Password=Password;
    await user.save();
    res.json({ mensaje: 'contraseña cambiada exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('error');
  }
});


router.get('/protected', verifyToken,  (req, res) => {
  res.send(`Hola ${req.user.username}, esta es una ruta protegida.`);
});
router.get('/users', verifyToken, async(req, res) => {

  try {
    const Users=await User.find({})
    return res.status(200).send(Users)
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).send('Error en el servidor');
  }
});
 
module.exports = router;