
var npatService = require("./npatService");


exports.login = function (req, res, next) {

    npatService.login(req, function (result) {

        if (result && result.success == 1) {


           var data = result.user;

            //var data = result.restaurant;

            
            var user = { id: data._id, email: data.email, username: data.username,  image: data.userPic }

            req.session.regenerate(function () {
            //     user.role = data.role == 1 ? 'superAdmin' : 'admin';
            //     user.isSuperAdmin = data.role == 1;
            //     req.session.user = user;
            //     //req.session.returl = returl;
            //     if (data.role == 1)
            //         res.redirect('/restaurants');
            //     else
            //         res.redirect('/restaurant/categories');
            res.redirect('/dashboard');
             });
            

        } else
            res.render('login', { layout: null /*, message: result.message */});
    })

}



