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
