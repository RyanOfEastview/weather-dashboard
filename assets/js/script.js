//document ready function here
$(document).ready(function() {

    var apiKey = "57be32d86e3ebb3698e86dbee385bf9e"; //my apiKey from openweathermap.org
    var city;
    var weatherId;
    var lat;
    var lon;
    var uvIndex = "";
    var uv;
    var savedCities= [];

    loadCities();

    init();


    // var apiCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    //current
    // var myApiCurrent = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid=${apiKey}&units=metric"

    // five days
    // var myApiFive = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={current,minutely,hourly}&appid=${apiKey}&units=metric"


    //  Search function

    //  Listener
    $("#search-btn").on("click", function () {
        event.preventDefault();
        console.log("this works");
        //  City search
        if ($("#search").val() !== "") {
            city = $("#search").val().trim();
        }
        getToday();
    });


    // saved cities section
    function addCity() {
        $("#past-searches").prepend($("<button>").attr("type", "button").attr("data-city", city).addClass("past text-muted list-group-item list-group-item-action").text(city));
        $("#search").val("");
    }

    // saved cities will save as buttons
    // saved button listener
    $("#past-searches").on("click",".past",function () {
        event.preventDefault();
        city = $(this).attr("data-city");
        getToday();
    });

    function checkPast () {
        if ( $(`#past-searches button[data-city="${city}"]`).length ) { 
          $("#search").val("");
        } else {
          addCity();
          savedCities.push(city);
          localStorage.setItem("cities", JSON.stringify(savedCities))
        }
      }

    // Today's weather
    function getToday() {
        var apiCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        
        $.ajax({
            url:apiCurrent,
            method: "GET",
            error:function () {
                alert("City not found.  Please try again.");
                $("#search").val("");
            }
        }).then(function (response) {
            checkPast();
            weatherId = response.weather[0].id;
            decodeWeatherId();

            $("#city").text(response.name);
            $("#temp").text(`${response.main.temp} °C`);
            $("#humidity").text(`${response.main.humidity} %`);
            $("#wind").text(`${response.wind.speed} Km/h`);
            $("#today-img").attr("src", `./assets/images/${weather}.svg`).attr("alt",weather);

            lat = response.coord.lat;
            lon = response.coord.lon;

            getUV();
            getFiveDay();
        });
    }

    // Get UV - TUTOR!!  UV not displaying
    function getUV() {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`,
        method: "GET"
      }).then(function (response) {
        uvIndex = response.value;
        decodeUV();
        $("#uv").text(uvIndex).css("background-color", uv);
      })
    }

    // Five Day Forecast - TUTOR!!  Forecast not displaying
    function getFiveDay() {
        var apiFive = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={current,minutely,hourly}&appid=${apiKey}&units=metric`
        $.ajax({
          url: apiFive,
          method: "GET"

        }).then(function (response) {
            for (var i = 0; i < 5; i++) {
                var unixTime = response.daily[i].dt;

                $(`#day${i}`).text(moment.unix(unixTime).format('l'));
                $(`#temp${i}`).text(`${response.daily[i].temp.day} °C`);
                $(`#humidity${i}`).text(`${response.daily[i].humidity} %`);
                
                weatherId = response.daily[i].weather[0].id;
                decodeWeatherId();
                $(`#img${i}`).attr("src", `./assets/images/${weather}.svg`).attr("alt", weather);
            }
        })
      }
    
    // The weather icon - how to change it according to weather conditions

    function decodeWeatherId() {
        switch (true) {
          case (weatherId > 199 && weatherId < 299):
            weather = "thunderstorm";
            break;
          case (weatherId > 299 && weatherId < 599):
            weather = "rain";
            break;
          case (weatherId > 599 && weatherId < 699):
            weather = "snow";
            break;
          case (weatherId > 699 && weatherId < 799):
            weather = "alien";
            break;
          case weatherId === 800:
            weather = "sunny";
            break;
          case weatherId > 800:
            weather = "clouds"
        }
      }    

      function decodeUV() {
        uv = "";
        switch (true) {
          case (uvIndex >= 0 && uvIndex < 3):
            uv = "green";
            break;
          case (uvIndex >= 3 && uvIndex < 6):
            uv = "blue";
            break;
          case (uvIndex >= 6 && uvIndex < 8):
            uv = "orange";
            break;
          case (uvIndex >= 8 && uvIndex < 11):
            uv = "red";
            break;
          case (uvIndex >= 11):
            uv = "violet"
        }
      }


    // Load Cities
    function loadCities() {
        var storedCities = JSON.parse(localStorage.getItem("cities"));
        if (storedCities !== null) {
          savedCities = storedCities;
          renderCities();
        } else {
          city = "Ottawa"
          checkPast();
        }
      }
    
      function renderCities() {
        for (var i = 0; i < savedCities.length; i++) {
          city = savedCities[i];
          addCity();
        }
      }
    
      // Clear Storage ---TUTOR!  Gives page alert when clicked.
    
      $("#clear").on("click", function () {
        localStorage.clear();
        savedCities = [];
        $("#past-searches").empty();
        city = "Ottawa";
        init();
      })
    
     
      // Initialize
      function init() {
        getToday();
      }
    
    });