(function() {
"use strict";
  var userPollsApiUrl = appUrl + "/api/:id";
  var pollApiUrl = appUrl + "/api/poll/";
  var pollDetailsUrl = appUrl + "/polldetails?pollId=";

  function showMyPolls(data) {

    var pollsObject = JSON.parse(data).polls;
    $(".list-group").empty();
    $.each(pollsObject, function(index, value) {
      $(".list-group").append("<li class=\"list-group-item\"><a href=\"" +
        pollDetailsUrl + value._id + "\">" + value.question +
        "</a><button type=\"button\" class=\"btn btn-danger\" id=\"" + 
        value._id + "\">Delete</button></li>");
      $("#" + value._id).on("click", function() {
        var r = confirm("Are you sure you want to delete this poll?");
        if (r === true) {
          ajaxFunctions.ajaxRequest("DELETE", pollApiUrl + 
            value._id, function(){
            ajaxFunctions.ajaxRequest("GET", userPollsApiUrl, showMyPolls);
          });
        }
      });
    });
  }
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", userPollsApiUrl, 
    showMyPolls));
}());
