'use strict';
(function() {
  
  var apiUrl = appUrl + '/api/latestPolls';
  var pollDetailsUrl = appUrl + '/polldetails?pollId=';
  
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data){
    var pollData = JSON.parse(data)
    $('.list-group').empty();
    pollData.forEach(function(value,index) {
      $('.list-group').append('<li class="list-group-item"><a href="' +
        pollDetailsUrl + value._id + '">' + value.question +
        '</a></li>');
    })
  }));
  
})();