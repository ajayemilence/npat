var request = require("request");
var format = require('string-format');
var httpService = require('../base/httpService');
var timeAgo = require('node-time-ago');
let base_url = process.env.API_URL;
var fs = require('fs');


exports.CreateRestaurant = function (req, callback) {
  var data=req.body;
  data.restaurantImage= fs.createReadStream(req.files.restaurantImage.path) ;
  let url = format("{}restaurant/register", base_url);
  httpService.uploadFormRequest(url, data, function (data) {
    callback(data.body)
  });
}

exports.login = function (req, callback) {
  let url = format("{}account/login", base_url);
  httpService.postRequest(url,'', req.body, function (data) {
    callback(data.body)
  });
}

//=============admin ========================
exports.getnames = function (pin ,callback) {
  let url = format("{}adminHuman/getAllNames", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}

exports.getplaces = function (pin ,callback) {
  let url = format("{}adminPlace/getAllplaces", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}

exports.getanimals = function (pin ,callback) {
  let url = format("{}adminAnimal/getAllanimals", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}

exports.getthings = function (pin ,callback) {
  let url = format("{}adminThing/getAllthings", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}

exports.getplants = function (pin ,callback) {
  let url = format("{}adminPlant/getAllplants", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}

//================game get ===========================

exports.getnamesGame = function (pin ,callback) {
  let url = format("{}human/getAllNames", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}

exports.getplacesGame = function (pin ,callback) {
  let url = format("{}place/getAllplaces", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}

exports.getanimalsGame = function (pin ,callback) {
  let url = format("{}animal/getAllanimals", base_url);
  httpService.getResponse(url, "", function (error, data) {
    console.log(data.data);
    callback(data.data)
  });
}

exports.getthingsGame = function (pin ,callback) {
  let url = format("{}thing/getAllthings", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}

exports.getplantsGame = function (pin ,callback) {
  let url = format("{}plant/getAllplants", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}

//=======dashboard get api ===============

exports.getwords = function (pin ,callback) {
  let url = format("{}admin/getAllWords", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}


//===============create name =======================

exports.createName = function (req, callback) {
  //var data=req.body;
  let url = format("{}adminHuman/addHuman", base_url);
  httpService.postRequest(url, '', req.body, function (data) {
    callback(data.body)
  });
}

exports.createPlace = function (req, callback) {
  //var data=req.body;
  let url = format("{}adminPlace/addPlace", base_url);
  httpService.postRequest(url, '', req.body, function (data) {
    callback(data.body)
  });
}

exports.createAnimal = function (req, callback) {
  console.log("idahr prrr aaa raaahhaaa haaiii yeeehhhhh");
  // var data=req.body;
  let url = format("{}adminAnimal/addAnimal", base_url);
  httpService.postRequest(url, '', req.body, function (data) {
    callback(data.body)
  });
}


exports.createThing = function (req, callback) {
  //var data=req.body;
  let url = format("{}adminThing/addThing", base_url);
  httpService.postRequest(url, '', req.body, function (data) {
    callback(data.body)
  });
}

exports.createPlant = function (req, callback) {
  //var data=req.body;
  let url = format("{}adminPlant/addPlant", base_url);
  httpService.postRequest(url, '', req.body, function (data) {
    callback(data.body)
  });
}
