const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

// app.use((err, req,res, next) => {

// });

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(PORT, () => {
    console.log('Server is running');
  });
}

main();
