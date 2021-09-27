var APIKey = "";
var searchBtn = $("#searchBtn");
var historyBtn = $(".historyBtn");

//search for that city using fetch(requesturl) to grab lat and lon, which then puts it through another fetch() to grab actual current and daily forecast
function fetchWeather() {

    var city = localStorage.getItem("city");
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    
        fetch(queryURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);

                var coord = data.coord;
                localStorage.setItem("coord",JSON.stringify(coord));
            });
    
    //grab the coord of lat and long after user inputs city and use that to return onecall for forecast
    var coord = JSON.parse(localStorage.getItem("coord"));
    var lat = coord.lat;
    var lon = coord.lon;
    var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&appid=" + APIKey;

        fetch(oneCallURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);

                var forecast = data.daily;
                localStorage.setItem("forecast",JSON.stringify(forecast));
            });
}

//checks search bar to clear any duplicates that might appear in the list

//posts info from fetch url to the boxes on the right

//function that changes uv index color

//two event listeners
//submit button where user input city  into the search bar and then hits enter or search, it will grab the city value and store it
//1. fetch weather data and return the 7 day forecast
//2. and once that city id is stored into local storage, it will dynamically create a link/button that will associate an id with that city name
searchBtn.on("click", function() {
    var city = $(this).siblings("#inputSearch").val();

    if (city !== null) {
        localStorage.setItem("city",city);
    }

    fetchWeather();
})

//2. search history button with unique city ids when clicked will
//1. fetch weather data and return the 7 day forecast
// historyBtn.on("click", function() {
//     var city = $(this).attr("city");

//     localStorage.setItem(city);
//     fetchWeather();
// })