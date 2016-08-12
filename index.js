/*jshint camelcase: false*/
/*global escape: true*/
'use strict';

var request = require('request'),
_ = require('lodash');

var API_BASE = 'https://sms.comtele.com.br/api',
MAX_SMS_LEN = 160,
API_KEY;

function getTextLength(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    if (escape(str.charAt(i)).length === 6) {
      len++;
    }
    len++;
  }
  return len;
}

exports.init = function (config, cb) {
  if (!config.key) {
    return cb && cb(new Error('key is missing'));
  }
  API_KEY = config.key;
};

_.each(['balance'], function (cmd) {
  exports[cmd] =  function (cb) {
    request.get({
      url: [API_BASE, API_KEY, cmd].join('/'),
    }, function (err, res, body) {
      if (res && res.statusCode >= 300 || res && res.statusCode < 200) {
        return cb && cb(new Error(body && body.code));
      }
      return cb && cb(err, body);
    });
  };
});

exports.send = function (body, cb) {
  if (body.type === 'SMS' && getTextLength(body.text) > MAX_SMS_LEN) {
    return cb && cb(new Error('too long SMS messge'));
  }
  request.post({
    url: [API_BASE, API_KEY, 'sendmessage'].join('/'),
    qs: {
      sender: body.from,
      receivers: body.to,
      content: body.text
    }
  }, function (err, res, body) {
    if (res && res.statusCode >= 300 || res && res.statusCode < 200) {
      return cb && cb(new Error(body && body.code));
    }
    return cb && cb(err, body);
  });
};
