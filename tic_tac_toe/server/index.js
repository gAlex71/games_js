const express  = require('express');
const path = require('path');

const app = express();
// middleware для работы со статическими файлами
app.use(express.static(path.join(__dirname, '..', 'front')));
app.listen(3000);