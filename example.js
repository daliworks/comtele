'use strict';

var comtele = require('./');

comtele.init({
  key: 'your_api_key'
});

comtele.balance(function (err, result) {
  console.log('result err=%s, result', err, result);
});

comtele.send({
  to: 'recepient number', 
  from: 'sender number', // your number
  type: 'SMS', // message type
  text: 'plz ignore this is test message, testabcdef1234567890'
}, function (err, result) {
  console.log('result err=%s, result', err, result);
});
