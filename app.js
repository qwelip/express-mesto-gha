const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

// todo написать ф-ю чтобы подключение было сначала к базе, а потом поднимался сервер
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '626f94ae3eaea50ac65a27d6',
  };
  next();
});

app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/cards', cardsRouter);

// todo нужен ли этот кусок
app.listen(PORT, () => {
  console.log('Server is running');
});
