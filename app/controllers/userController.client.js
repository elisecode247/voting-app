'use strict';

(function () {

   var displayName = document.querySelector('#display-name');
   var apiUrl = appUrl + '/api/:id';

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data){
      var userObject = JSON.parse(data);
      if (userObject.github.displayName !== null) {
         displayName.innerHTML = userObject.github.displayName
      } else {
         displayName.innerHTML = userObject.github.username
      }
   }));
})();
