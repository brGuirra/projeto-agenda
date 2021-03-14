const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  res.render('login');
};

// Como no método há funções assíncronas,
// é preciso usar async/await ao exportar
// o controller
exports.register = async (req, res) => {
  try {
    // Instancia o corpo da requisição na classe Login
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length) {
      // Salva as mensagens de erro para serem exibidas no form
      req.flash('errors', login.errors);

      // Salva a sessão antes de redirecionar para a
      // página de login de novo
      req.session.save(() => {
        // Redireciona para a página anterior, que seria
        // a página de login
        return res.redirect('back');
      });

      return;
    }

    req.flash('success', 'Usuário criado com sucesso');

    // Salva a sessão antes de redirecionar para a
    // página de login de novo
    req.session.save(() => {
      // Redireciona para a página anterior, que seria
      // a página de login
      return res.redirect('back');
    });
  } catch (err) {
    console.log(err);
    return res.render('404');
  }
};
