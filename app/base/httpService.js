var request = require("request");
let user_agent='octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0';

exports.getResponse = function (url, token, callback) {
    var options = {
        method: 'GET',
        url: url, //along with qs parameters;
        // headers: getHeader(token)
    };

    request(options, function (error, response, body) {
        if (error) return null;
        callback(error, JSON.parse(body));
        console.log(error ,"eeeerrrrorrrrrr");
    });
}

exports.postRequest = function (url, token, body, callback) {
    sendRequest(url, token, body, 'POST', function (data) {
        callback(data);
    });
}

exports.putRequest = function (url, token, body, callback) {
    sendRequest(url, token, body, 'PUT', function (data) {
        callback(data);
    });
}

exports.patchRequest = function (url, token, callback) {
    sendRequest(url, token, null, 'PATCH', function (data) {
        callback(data);
    });
}
exports.DeleteRequest = function (url, token, callback) {
    sendRequest(url, token, null, 'DELETE', function (data) {
        callback(data);
    });
}

 function sendRequest(url, token, body, method, callback) {
    var options = {
        method: method,  url: url, body: body, json: true,
        headers: getHeader(token)
    };
    request(options, function (error, response, body) {
        callback({error:error,body:body,response:response});
    });
}

// exports.uploadFormRequest=function(url, form, callback) {   
//     var options = { method: 'POST',
//     url: url,
//     headers: {'content-type': 'multipart/form-data;'  }, formData: form };
//     request(options, function (error, response, body) {
//         callback({error:error,body:JSON.parse(body),response:response});
//     });
// }

// exports.uploadFormRequest=function(url,methodType, form, callback) {   
//     var options = { method: methodType,
//     url: url,
//     headers: {'content-type': 'multipart/form-data;'  }, formData: form };
//     request(options, function (error, response, body) {
//         callback({error:error,body:JSON.parse(body),response:response});
//     });
// }


exports.uploadFormRequest=function(url,/*methodType,*/ form, callback) {   
    var options = { method: 'POST',
    url: url,
    headers: {'content-type': 'multipart/form-data;'  }, formData: form };
    request(options, function (error, response, body) {
        callback({error:error,body:JSON.parse(body),response:response});
    });
}


function getHeader(token){
    return {
        'User-Agent': user_agent,
        // authorization: 'token ' + token,
        'content-type': 'application/json'
    }
}