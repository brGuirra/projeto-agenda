exports.middlewareGlobal = (req, res, next) => {
  // Captura as mensagens de erro e sucesso e salva para
  // serem acessíveis globalmente
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  next();
};

exports.outroMiddleware = (req, res, next) => {
  next();
};

// Qualquer erro na aplicação será exibida a página 404
exports.checkCsrfError = (err, req, res, next) => {
  if (err) {
    return res.render('404');
  }

  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

// Impede o acesso de um usuário não logado
// a sessão de contatos
exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash('errors', 'Você precisa fazer login');
    req.session.save(() => res.redirect('/'));

    return;
  }

  next();
};
