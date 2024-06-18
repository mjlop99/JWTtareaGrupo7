require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const verifyToken=require('./middleware/auth')

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => {
  console.log('Conectado a MongoDB');
}).catch((err) => {
  console.error('Error conectando a MongoDB', err);
});

app.use('/api/auth', authRoutes);
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/secreto', verifyToken ,(req, res) => {
  res.sendFile(path.join(__dirname,'views',  'paginaSecreta.html'));
});
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
