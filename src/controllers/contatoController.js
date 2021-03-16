const Contato = require('../models/ContatoModel');

// O contato vazio previne um erro por
// não ter os dados do contato para serem
// renderizados no form
exports.index = (req, res) => {
  res.render('contato', {
    contato: {},
  });
};
exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body);

    await contato.register();

    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('back'));

      return;
    }

    req.flash('success', 'Contato registrado com sucesso');
    req.session.save(() =>
      res.redirect(`/contato/index/${contato.contato._id}`)
    );
  } catch (err) {
    console.log(err);
    res.render('404');
  }

  return;
};

exports.editIndex = async (req, res) => {
  // Se não houver o id do usuário rederiza 404
  if (!req.params.id) return res.render('404');

  const contato = await Contato.buscaPorId(req.params.id);

  if (!contato) return res.render('404');

  return res.render('contato', {
    contato,
  });
};

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render('404');

    const contato = new Contato(req.body);

    await contato.edit(req.params.id);

    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('back'));

      return;
    }

    req.flash('success', 'Contato editado com sucesso');
    req.session.save(() =>
      res.redirect(`/contato/index/${contato.contato._id}`)
    );
  } catch (err) {
    console.log(err);
    res.render('404');
  }

  return;
};
