

  // set your channel id here
  var channel_id = 114698;
  // set your channel's read api key here if necessary
  var api_key = '';
  // maximum value for the gauge
  var max_gauge_value = 1023;
  // name of the gauge
  var gauge_name = 'Temp(ºC)';

  var requestURL = 'http://api.openweathermap.org/data/2.5/weather?lat=40.424&lon=-86.907&appid=fd9c2ee97f1189935a19b6a0d01687d6';
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();
  console.print

  request.onload = function() {
    var openTempResponse = request.response;
    //console.log(openTemp['main']['temp']);
    openTempK = openTempResponse['main']['temp'];
    openTempC = openTempK - 273.15;
    openTempC4 = openTempC.toPrecision(4);
    openTempDescr = openTempResponse['weather'][0]['description'];
  console.log(openTempResponse);
}

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
      // if there is a data point display it
      if (p) {
        p = p.substring(0, 4);
        //p = Math.round((p / max_gauge_value) * 100);
        displayData(p);
      }
      document.getElementById("openWeather").innerHTML = 'OpenWeather Data: '+openTempC4 + 'ºC';
      document.getElementById("openWeatherDescr").innerHTML = openTempDescr;
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