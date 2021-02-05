var today = moment().format("MMMM Do YYYY");
var cities = [];

function displayCityInfo(city) {
  $("#citySearch").val("");
  $("#dayCast").empty();
  $("#city").empty();
  $("#previousSearch").empty();
  cities.map((city) => {
    var ci = $("<button>");
    ci.addClass("pastcity rounded bg-info text-white");
    ci.attr("data-name", city);
    ci.text(city);
    $("#previousSearch").prepend(ci);
  });

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=6d04cdd4b56594f37842d3a236ca3d6f";
  var forecastURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=6d04cdd4b56594f37842d3a236ca3d6f";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var newDiv = $("<div>");
    var weatherIcon = response.weather[0].icon;
    var weatherURL =
      "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    var imgEl = $("<img>");
    imgEl.attr("src", weatherURL);
    var rCity = response.name;
    var rCityEl = $("<h3>");
    rCityEl.html(rCity + ", " + today);
    rCityEl.addClass("font-weight-bold focus");
    rCityEl.append(imgEl);
    newDiv.append(rCityEl);

    var rTemp = response.main.temp;
    var rTempEl = $("<p>");
    rTempEl.html("Temperature: " + rTemp + " F");
    newDiv.append(rTempEl);

    var rHumidity = response.main.humidity;
    var rHumidityEl = $("<p>");
    rHumidityEl.html("Humidity: " + rHumidity + "%");
    newDiv.append(rHumidityEl);

    var rWind = response.wind.speed;
    var rWindEl = $("<p>");
    rWindEl.html("Wind Speed: " + rWind + "MPH");
    newDiv.append(rWindEl);

    var lat = response.coord.lat;
    var lon = response.coord.lon;

    uvURL =
      "http://api.openweathermap.org/data/2.5/uvi?appid=6d04cdd4b56594f37842d3a236ca3d6f&lat=" +
      lat +
      "&lon=" +
      lon;

    $.ajax({
      url: uvURL,
      method: "GET",
    }).then(function (response) {
      var rUv = response.value;
      var rUvEl = $("<p>");
      rUvEl.html("UV Index: " + rUv);
      newDiv.append(rUvEl);
    });

    $("#city").append(newDiv);
  });

  $.ajax({
    url: forecastURL,
    method: "GET",
  }).then(function (response) {
    for (let i = 0; i < 5; i++) {
      var day = response.list[8 * i].dt_txt;
      var subDay = day.substring(0, 10);
      var iDiv = $("<div>");
      var card = $("<div>");
      var cardBody = $("<div>");
      var theDate = $("<h3>");
      theDate.addClass("card-title");
      iDiv.addClass("col-sm");
      card.addClass("card bg-info text-white");
      cardBody.addClass("card-body");
      card.attr("style", "width: auto");

      theDate.append(subDay);
      cardBody.append(theDate);

      var weatherIcon = response.list[8 * i].weather[0].icon;
      var weatherURL =
        "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
      var imgEl = $("<img>");
      imgEl.attr("src", weatherURL);
      cardBody.append(imgEl);

      var rTemper = response.list[8 * i].main.temp;
      var rTemperEl = $("<p>");
      rTemperEl.addClass("card-text");
      rTemperEl.html("Temperature: " + rTemper + " F");
      cardBody.append(rTemperEl);

      var rHumid = response.list[8 * i].main.humidity;
      var rHumidEl = $("<p>");
      rHumidEl.addClass("card-text");
      rHumidEl.html("Humidity: " + rHumid + "%");
      cardBody.append(rHumidEl);

      card.append(cardBody);
      iDiv.append(card);
      $("#dayCast").append(iDiv);
    }
  });
}

if (localStorage.getItem("city")) {
  JSON.parse(localStorage.getItem("city")).map((city) => cities.push(city));
  displayCityInfo(cities[cities.length - 1]);
}

function pastCity() {
  let newCity = $(this).attr("data-name");
  displayCityInfo(newCity);
}

$("#clearMe").on("click", function (event) {
  event.preventDefault();
  event.stopPropagation();
  $("#previousSearch").empty();
  localStorage.clear();
});

$("#search").on("click", function (event) {
  event.preventDefault();
  event.stopPropagation();
  var city = $("#citySearch").val().trim();
  if (cities.includes(city) === false) {
    cities.push(city);
  }
  displayCityInfo(city);
  localStorage.setItem("city", JSON.stringify(cities));
});

$(document).on("click", ".pastcity", pastCity);
