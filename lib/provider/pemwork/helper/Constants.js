'use strict';

var o = require('observable');

var Constants = {
  HIDE_CLASS: 'pp-hidden',
  CANDIDATES_URL: 'http://localhost/BPM/Process/GetAssignableCandidates',
  general: o(1)
};

setInterval(function(){
  console.log(Constants.general());
  Constants.general(Constants.general()+1);
}, 2000);

module.exports = Constants;
