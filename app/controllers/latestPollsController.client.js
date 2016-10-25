'use strict';
(function() {
  
  var apiUrl = appUrl + '/api/latestPolls';

  function showLatestPolls(data) {
    var pollObject = JSON.parse(data);
    var pollTitle = pollObject.polls[0].question;
    $('.list-group').append(pollTitle)

  }
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET',apiUrl,showLatestPolls));
  
})();