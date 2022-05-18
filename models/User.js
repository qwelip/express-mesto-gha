const mongoose = require('mongoose');
const stringValidator = require('validator');

// eslint-disable-next-line
const urlRegExp = new RegExp('^(https?:)\/\/(www.)?[a-z0-9./_~:/?#@!$&()*+,;=\\]\\[-]+#?$');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
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
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(str) {
        return urlRegExp.test(str);
      },
      message: 'Введите корректную ссылку',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
