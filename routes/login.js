//var express = require('express');
var router = express.Router();
var loginService = require('../app/services/login')

router.get('/', function (req, res) {
    var session = req.session;
    if (session && session.user)
        res.redirect('/repositories');
    else
        res.render('login', { layout: null, title: 'Express' });
});

router.get('/logout', function (req, res) {

    req.session.destroy(function () {
        res.redirect('/');
    });
});

router.get('/', function (req, res) {
    var session = req.session;
    if (session && session.user) {
        let redirectTo = '/dashboard' ;
        //let redirectTo = session.user.isSuperAdmin ? '/restaurants' : '/restaurant/categories';
        res.redirect(redirectTo);
    }
    else
        res.render('login', { layout: null });

});

router.post('/', loginService.login);


module.exports = router;