const APIKey = "dd11198ebdc5895309b017802e885bda";
var searchBtn = $("#searchBtn");
var historyBtn = $(".historyBtn");
var citiesSearched = [];

//search for that city using fetch(requesturl) to grab lat and lon, which then puts it through another fetch() to grab actual current and daily forecast
function getWeather() {
    var city = localStorage.getItem("city");
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
    
        fetch(queryURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);

                var coord = data.coord;
                localStorage.setItem("coord",JSON.stringify(coord));
            });
    
    getOneCall();
}

function getOneCall () {
    //grab the coord of lat and long after user inputs city and use that to return onecall for forecast
    var coord = JSON.parse(localStorage.getItem("coord"));
    var lat = coord.lat;
    var lon = coord.lon;
    console.log(lat);
    console.log(lon);
    var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&appid=" + APIKey + "&units=imperial";

        fetch(oneCallURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);

                var forecast = data.daily;
                localStorage.setItem("forecast",JSON.stringify(forecast));
            });
    postCurrentWeather();
}

function postCurrentWeather() {
    var city = localStorage.getItem("city");

    var forecast = JSON.parse(localStorage.getItem("forecast"));
    console.log(forecast);

    var unixDate = forecast[0].dt;
    var dateObject = new Date(unixDate*1000);
    var date = dateObject.toLocaleDateString();
    var iconcode = forecast[0].weather[0].icon;
    var iconurl = "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";

    $("#currentdate").text(city + " " + date);
    $("#currenticon").attr("src", iconurl);
    $("#currenttemp").text("Temp: " + forecast[0].temp.day + "°F");
    $("#currentwind").text("Wind: " + forecast[0].wind_speed + "MPH");
    $("#currenthumidity").text("Humidity: " + forecast[0].humidity + "%");

    postUV();
}

//function that changes uv index color
function postUV() {
    var forecast = JSON.parse(localStorage.getItem("forecast"));

    console.log(forecast);
    $("#UVIndex").text("UV Index: " + forecast[0].uvi);

    //if else statements for uv index color change
    postForecast();
}

// posts info from fetch url to the boxes on the right
function postForecast() {
    $(".card").each(function(i) {
        var forecast = JSON.parse(localStorage.getItem("forecast"));
        var unixDate = forecast[i+1].dt;
        var dateObject = new Date(unixDate*1000);
        var date = dateObject.toLocaleDateString();
        var iconcode = forecast[i+1].weather[0].icon;
        var iconurl = "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";
        var temp = forecast[i+1].temp.day;
        var wind = forecast[i+1].wind_speed;
        var humidity = forecast[i+1].humidity;
        
        console.log(date);
        
        $(this).children(".date").text(date);
        $(this).children(".iconForecast").attr("src", iconurl);
        $(this).children(".temp").text("Temp: " + temp + "°F");
        $(this).children(".wind").text("Wind: " + wind + "MPH");
        $(this).children(".humidity").text("Humidity: " + humidity + "%");
    })
}

function searchHistory() {
    var citiesSearched = JSON.parse(localStorage.getItem("citiesSearched"));
    console.log(citiesSearched);

    for (i=0; i < citiesSearched.length; i++) {
        var tempBtn = document.createElement('button');
        tempBtn.textContent = (citiesSearched[i]);
        $("#searchHistory").append(tempBtn);
        tempBtn.setAttribute("class", "col-12 historyBtn");
        tempBtn.setAttribute("id", citiesSearched[i]);
        tempBtn.setAttribute("style", "padding-top: 5px; padding-bottom: 5px, margin-top: 10px, margin-bottom: 10px;")
    }
}

function clearSearchHistory() {
    $(".historyBtn").remove();
}
//two event listeners
//submit button where user input city  into the search bar and then hits enter or search, it will grab the city value and store it
//1. fetch weather data and return the 7 day forecast
//2. and once that city id is stored into local storage, it will dynamically create a link/button that will associate an id with that city name AND checks search bar to clear any duplicates that might appear in the list
searchBtn.on("click", function(event) {
    event.preventDefault();
    clearSearchHistory();
    var city = $(this).siblings("#inputSearch").val();
    if (city !== null) {
        localStorage.setItem("city",city);
        citiesSearched.push(city);
        localStorage.setItem("citiesSearched",JSON.stringify(citiesSearched));
    }

    getWeather();
    searchHistory();
})

//1. search history button with unique city ids when clicked will
//2. fetch weather data and return the 7 day forecast
 $(document).on("click", "#searchHistory .historyBtn", function() {
     clearSearchHistory();

     var city = $(this).attr("id");
     console.log(city);

     if (city !== null) {
        localStorage.setItem("city",city);
     }

     getWeather();
     searchHistory();
})