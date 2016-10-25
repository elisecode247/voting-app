'use strict';
(function() {
  var searchString = window.location.search
  var pollId = searchString.substr(searchString.indexOf("pollId=") + 7, 24)
  var pollDetailsUrl = appUrl + '/api/poll/' + pollId;
  var deleteButton = document.querySelector('.btn-delete');
  

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('get', pollDetailsUrl, function(data) {
    var pollObject = JSON.parse(data);
    var pollTitle = pollObject.polls[0].question;
    var pollOptions = pollObject.polls[0].answers;
    document.querySelector('#pollTitle').innerHTML = pollTitle
    $('.btn-twitter').attr('data-url', document.URL);
    $.each(pollOptions, function(index, value) {
      if (index === pollOptions.length -1) {
        $('#choices').prepend('<option selected>' + value.answer + '</option>');
      }
      else {
        $('#choices').prepend('<option>' + value.answer + '</option>');
      }
    });
    
    
    var svg = d3.select("svg")
    var container = $('.jumbotron')[0];
    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 80
      },
      targetWidth = container.offsetWidth - 120,
      width = targetWidth - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    svg
      .attr("width", targetWidth)
      .attr("height", 500)

    var x = d3.scaleBand().range([0, width]).padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var data = pollOptions;

    var voteMax = d3.max(data, function(d) {
      return d.votes;
    })
    x.domain(data.map(function(d) {
      return d.answer;
    }));
    y.domain([0, d3.max(data, function(d) {
      return d.votes;
    })]);
    svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d.answer);
      })
      .attr("width", x.bandwidth())
      .attr("y", function(d) {
        return y(d.votes);
      })
      .attr("height", function(d) {
        return height - y(d.votes);
      })
      .attr("fill", function(d, i) {
        return color(i);
      });
    svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
      .call(d3.axisBottom(x));
    svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(d3.axisLeft(y).ticks(voteMax).tickFormat(d3.format("d")));

  }))
})()