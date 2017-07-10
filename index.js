

  // set your channel id here
  var channel_id = 114698;
  // set your channel's read api key here if necessary
  var api_key = '';
  // maximum value for the gauge
  var max_gauge_value = 1023;
  // name of the gauge
  var gauge_name = 'Temp(ºC)';

  // global variables
  var chart, charts, data;

  // load the google gauge visualization
  google.load('visualization', '1', {packages:['gauge']});
  google.setOnLoadCallback(initChart);

  // display the data
  function displayData(point) {
    data.setValue(0, 0, gauge_name);
    data.setValue(0, 1, point);
    chart.draw(data, options);
  }

  // load the data
  function loadData() {
    // variable for the data point
    var p;

    // get the data from thingspeak
    $.getJSON('https://api.thingspeak.com/channels/' + channel_id + '/feed/last.json?api_key=' + api_key, function(data) {

      // get the data point
      p = data.field1;
      if (data.field1 < 8)
        document.getElementById("yeastState").innerHTML = "Brrr, its freeezing in here you blithering fool!";
      else if(data.field1 < 12)
        document.getElementById("yeastState").innerHTML = "It is a tad bit nippy here!"
      else if(data.field1 < 14)
        document.getElementById("yeastState").innerHTML = "shan <3";
      else if(data.field1 < 18)
        document.getElementById("yeastState").innerHTML = "shan <3";
      else if(data.field1 < 24)
        document.getElementById("yeastState").innerHTML = "Wheeee <3 ";
      else if(data.field1 < 26)
        document.getElementById("yeastState").innerHTML = "Did someone say global warming? :O";
      else if(data.field1 < 30)
        document.getElementById("yeastState").innerHTML = "Global Warming is real! Nuuuuu :(";
      else if(data.field1 > 30)
        document.getElementById("yeastState").innerHTML = "superHOT";



      // if there is a data point display it
      if (p) {
        p = p.substring(0, 4);
        //p = Math.round((p / max_gauge_value) * 100);
        displayData(p);
      }

    });
  }

  // initialize the chart
  function initChart() {

    data = new google.visualization.DataTable();
    data.addColumn('string', 'Label');
    data.addColumn('number', 'Value');
    data.addRows(1);

    chart = new google.visualization.Gauge(document.getElementById('gauge_div'));
    options = {width: 500, height: 500, greenFrom:14, greenTo:24 , redFrom: 28, redTo: 35, yellowFrom:24, yellowTo: 28, minorTicks: 5, max:35};

    loadData();

    // load new data every 15 seconds
    setInterval('loadData()', 15000);
  }