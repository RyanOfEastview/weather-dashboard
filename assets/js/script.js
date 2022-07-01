//document ready function here
$(document).ready(function() {

var apiKey = "57be32d86e3ebb3698e86dbee385bf9e"; //my apiKey from openweathermap.org
var city;
var weatherId;
var lat;
var lon;
var uvIndex = "";
var uv;
var savedCitites= [];

// var apiCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

//current
// var myApiCurrent = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid=${apiKey}&units=metric"

// five days
// var myApiFive = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={current,minutely,hourly}&appid=${apiKey}&units=metric"

loadcities();

init();


//  Search function

//  Listener
$("#search-btn").on("click", function () {
    event.preventDefault();
    //  City search
    if ($("#search").val() !== "") {
        city = $("#search").val().trim();
    }
    getToday();
});


// saved cities section


// saved cities will save as buttons
// saved button listener

// Today's weather


// Five Day Forecast


// The weather icon


});