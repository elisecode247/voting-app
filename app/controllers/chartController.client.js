'use strict';
(function() {
  var searchString = window.location.search
  var pollId = searchString.substr(searchString.indexOf("pollId=") + 7, 24)
  var pollDetailsUrl = appUrl + '/api/poll/' + pollId;

  $('#otherOption').hide();
  $('#labelOtherOption').hide();

  $(".btn-vote").click(function() {
    if ($("#choices option:selected").text() === "Choose something else" &&
      $("#otherOption").val() === "") {
      $('form').submit(function(e) {
        e.preventDefault();
      })
      alert("You didn't write in a new option. Try again.")
    }
    else {
      $('form').submit(function(e) {
        e.preventDefault();
        $.ajax({
          url: pollDetailsUrl,
          type: "POST",
          data: $('form').serialize(),
          success: function(data) {
            if (!data) {
              alert("you have already voted before")
            }
            getPollDetails();
            $("#choices").hide();
            $('#labelChoices').hide();
            $('.btn-vote').hide();
            $('.btn-vote').hide();
            $('#otherOption').hide();
            $('#labelOtherOption').hide();
          },
          error: function(jXHR, textStatus, err) {
            alert(err);
          }
        });
      });
    }
  });

  $('form').change(function() {

    if ($("#choices option:selected").text() === 'Choose something else') {
      $('#otherOption').show();
      $('#labelOtherOption').show();
    }
    else {
      $('#otherOption').hide();
      $('#labelOtherOption').hide();
    }
  });

  ajaxFunctions.ready(getPollDetails)

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("text-align", "center")
    .style("font-size", "20px")

  var tooltipPositionLeft = function(voteNum) {
    if (voteNum < 10) {
      return 10;
    }
    else if (voteNum < 100) {
      return 21;
    }
    else {
      return 32;
    }
  }

  var svg = d3.select("svg")
  var container = $('.jumbotron')[0];
  var margin = {
      top: 80,
      right: 0,
      bottom: 30,
      left: 0
    },
    targetWidth = container.offsetWidth * .9,
    width = targetWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  svg
    .attr("width", targetWidth)
    .attr("height", 500)
  var color = d3.scaleOrdinal(d3.schemeCategory20);
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);

  function getPollDetails() {
    ajaxFunctions.ajaxRequest('get', pollDetailsUrl, function(data) {

      var pollObject = JSON.parse(data);
      var pollTitle = pollObject.polls[0].question;
      var pollOptions = pollObject.polls[0].answers;
      $('#pollTitle').text(pollTitle);
      $('#choices').not(':first').remove();
      $.each(pollOptions, function(index, value) {
        $('#choices').append('<option>' + value.answer + '</option>');
      });
      $('option').last().attr("selected", "selected");
      $('.btn-twitter').attr("href", "https://twitter.com/share?text=" + pollTitle)

      renderChart(pollOptions);
    })
  }

  function renderChart(pollOptions) {
    $('svg').empty()

    var voteMax = d3.max(pollOptions, function(d) {
      return d.votes;
    })
    x.domain(pollOptions.map(function(d) {
      return d.answer;
    }));
    y.domain([0, d3.max(pollOptions, function(d) {
      return d.votes;
    })]);
    svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").selectAll(".bar")
      .data(pollOptions)
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
      })
      .on("mouseover", function(d) {
        var rect = this.getBoundingClientRect();
        tooltip.transition()
          .style("opacity", .9)
        tooltip.html("<span style='font-size:2em; font-weight:bold'>" + d.votes + "</span> \n")
          .style("visibility", "visible")
          .style('left', rect.left + (x.bandwidth() / 2) - tooltipPositionLeft(d.votes) + 'px')
          .style('top', rect.top - 50 + 'px')
        d3.select(this)
          .style("opacity", 0.5)

      })
      .on("mouseout", function(d) {
        d3.select(this)
          .style("opacity", 1)
        tooltip.style("visibility", "hidden")
      })
    svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
      .call(d3.axisBottom(x));
  }

})()
