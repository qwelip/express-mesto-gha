const mongoose = require('mongoose');
const stringValidator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    role: { type: String, default: 'Жак-Ив Кусто' },
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(email) {
        return stringValidator.isEmail(email);
      },
      message: 'Введите корректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  about: {
    role: { type: String, default: 'Исследователь' },
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    role: { type: String, default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png' },
    validate: {
      validator(v) {
        return v.includes('https://') || v.includes('http://');
      },
      message: 'Введите корректную ссылку на изображение',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
