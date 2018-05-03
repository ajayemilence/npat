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


exports.getnames = function (pin ,callback) {
  let url = format("{}human/getAllNames", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}

exports.getplaces = function (pin ,callback) {
  let url = format("{}place/getAllplaces", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}

exports.getanimals = function (pin ,callback) {
  let url = format("{}animal/getAllanimals", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}

exports.getthings = function (pin ,callback) {
  let url = format("{}thing/getAllthings", base_url);
  httpService.getResponse(url, "", function (error, data) {
    callback(data.data)
  });
}

exports.getplants = function (pin ,callback) {
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
  let url = format("{}human/addHuman", base_url);
  httpService.postRequest(url, '', req.body, function (data) {
    callback(data.body)
  });
}

exports.createPlace = function (req, callback) {
  //var data=req.body;
  let url = format("{}place/addPlace", base_url);
  httpService.postRequest(url, '', req.body, function (data) {
    callback(data.body)
  });
}

exports.createAnimal = function (req, callback) {
  console.log("idahr prrr aaa raaahhaaa haaiii yeeehhhhh");
  // var data=req.body;
  let url = format("{}animal/addAnimal", base_url);
  httpService.postRequest(url, '', req.body, function (data) {
    callback(data.body)
  });
}


exports.createThing = function (req, callback) {
  //var data=req.body;
  let url = format("{}thing/addThing", base_url);
  httpService.postRequest(url, '', req.body, function (data) {
    callback(data.body)
  });
}

exports.createPlant = function (req, callback) {
  //var data=req.body;
  let url = format("{}plant/addPlant", base_url);
  httpService.postRequest(url, '', req.body, function (data) {
    callback(data.body)
  });
}
