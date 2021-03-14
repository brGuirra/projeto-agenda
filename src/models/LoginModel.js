const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;

    // Esse array conta os erros encontrados na
    // validação. Se estiver vazio o usuário pode
    // ser criado
    this.errors = [];
    this.user = null;
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return;

    await this.userExists();

    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    // Se não houver nenhum erro cria o usuário
    try {
      this.user = await LoginModel.create(this.body);
    } catch (err) {
      console.log(err);
    }
  }

  async userExists() {
    // Retorna se há um usuário cadastrado na base com o e-mail
    // preenchido no form
    const user = await LoginModel.findOne({ email: this.body.email });

    if (user) this.errors.push('Usuário já existe');
  }

  valida() {
    this.cleanUp();

    // Valida e-mail
    if (!validator.isEmail(this.body.email))
      this.errors.push('E-mail inválido');

    // Senha precisa ter entre 50 e 3 caracteres
    if (this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
    }
  }

  // Passava pelo body, o que não for string
  // vira uma vazia
  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
