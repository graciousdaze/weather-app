var latitude, longitude;
var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var iconConditions = {

}

getLocation();

//Use an API to get the User's current Location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            getWeather();
        });
    } else {
        latitude = 37.7749;
        longitude = 122.4194;
        getWeather();
    }
}

//Change Elements based on location's weather
function getWeather() {
    $.getJSON("https://api.apixu.com/v1/forecast.json?key=400447760cbd4ebf9f1194036181103&q=" + latitude + "," + longitude + "&days=7", function (json) {
        $("body").fadeOut(2000, function () {
            var forecasted = json.forecast.forecastday;
            //Change the city and region to the current location
            $("#city").html(json.location.name);
            $("#location").html(json.location.region + ", " + json.location.country);
            //Change the elements to match current Conditions
            $("#weatherType").html(json.current.condition.text);
            changeBackground();
            changeTemp();
            getForecastIcons(forecasted);
            //Change the Sunset/Sunrise times
            $("#sunrise").text(forecasted[0].astro.sunrise);
            $("#sunset").text(forecasted[0].astro.sunset);
            //Change the days on the Forecast
            for (var i = 1; i <= 3; i++) {
                var date = new Date(forecasted[i].date_epoch * 1000);
                $("#date" + i.toString()).text(weekdays[date.getDay()]);
            }
            $("body").fadeIn(2000);
            // console.log(json);
        });
    });
}

//On click switch between Farenheit and Celcius
$("#degreeType").on("click", function () {
    var tempType;
    if ($("#degreeType").text() === "F") {
        tempType = "C";
    } else {
        tempType = "F";
    }
    $(".projectedTemp").fadeOut(1000, function () {
        $("span.degType").text(tempType);
        changeTemp();
        $(".projectedTemp").fadeIn(1500);
    })
})

//Function to change temperture based on unit measurement
function changeTemp() {
    var location = $("#city").text();
    $.getJSON("https://api.apixu.com/v1/forecast.json?key=400447760cbd4ebf9f1194036181103&q=" + location + "&days=7", function (json) {
        var forecasted = json.forecast.forecastday;
        if ($("#degreeType").text() === "F") {
            $("#temp").html(json.current.temp_f.toFixed(0));
            for (var i = 0; i <= 3; i++) {
                $("#high" + i.toString()).text(forecasted[i].day.maxtemp_f.toFixed(0));
                $("#low" + i.toString()).text(forecasted[i].day.mintemp_f.toFixed(0));
            }
        } else {
            $("#temp").html(json.current.temp_c.toFixed(0));
            for (var i = 0; i <= 3; i++) {
                $("#high" + i.toString()).text(forecasted[i].day.maxtemp_c.toFixed(0));
                $("#low" + i.toString()).text(forecasted[i].day.mintemp_c.toFixed(0));
            }
        }
    });
}

//Function to change background image/icon depending on weather. It pulls the current weather type from the div "Weather Type". An object is used to map condition
//types to icons and backgrounds that match. The currentConditionType is used as the variable to access the properties associated with the key type. If the current
//condition does not exist in the list, the variable is set to default and the deafult icon and background are used to prevent an error.
function changeBackground() {
    var backgroundURL, iconClass, currentConditionType = $("#weatherType").text().toLowerCase();
    var currConditionsList = {
        sun:{
            icon: "wi wi-day-sunny",
            background:"https://images.unsplash.com/photo-1444090542259-0af8fa96557e?ixlib=rb-0.3.5&s=f034298e3c1cc2a2a532c969a69bbdfc&auto=format&fit=crop&w=1350&q=80"
        },
        mist:{
            icon:"wi wi-fog",
            background: "https://images.unsplash.com/photo-1455656678494-4d1b5f3e7ad4?ixlib=rb-0.3.5&s=f898f9cda6c8c3e0b2bf34482f7b9139&auto=format&fit=crop&w=1950&q=80"
        },
        fog:{
            icon:"wi wi-fog",
            background: "https://images.unsplash.com/photo-1455656678494-4d1b5f3e7ad4?ixlib=rb-0.3.5&s=f898f9cda6c8c3e0b2bf34482f7b9139&auto=format&fit=crop&w=1950&q=80"

        },
        overcast: {
            icon:"wi wi-fog",
            background: "https://images.unsplash.com/photo-1455656678494-4d1b5f3e7ad4?ixlib=rb-0.3.5&s=f898f9cda6c8c3e0b2bf34482f7b9139&auto=format&fit=crop&w=1950&q=80"
        },
        rain:{
            icon: "wi wi-rain",
            background: "https://images.unsplash.com/photo-1485797460056-2310c82d1213?ixlib=rb-0.3.5&s=01d1f4081a7cfb7eb572bca23cdf8df8&auto=format&fit=crop&w=1350&q=80"
        },
        cloud: {
            icon: "wi wi-cloudy",
            background: "https://images.unsplash.com/photo-1430950716796-677ecbc99485?ixlib=rb-0.3.5&s=1e4dfc341b01a40c6bb6f83d1081569c&auto=format&fit=crop&w=1950&q=80" 
        },
        snow: {
            icon: "wi wi-snowflake-cold",
            background: "https://images.unsplash.com/photo-1448724133127-81fbec83d1ae?ixlib=rb-0.3.5&s=642127541da66cdb859c1e537a10a735&auto=format&fit=crop&w=1950&q=80"
        },
        ice: {
            icon: "wi wi-snowflake-cold",
            background: "https://images.unsplash.com/photo-1448724133127-81fbec83d1ae?ixlib=rb-0.3.5&s=642127541da66cdb859c1e537a10a735&auto=format&fit=crop&w=1950&q=80"
        },
        clear: {
            icon: "wi wi-day-sunny",
            background: "https://images.unsplash.com/photo-1436984865625-d278e0c37da6?ixlib=rb-0.3.5&s=f7befefb624d88d78860c95c913c1bb9&auto=format&fit=crop&w=2134&q=80"
        },
        default: {
            icon: "wi wi-cloud",
            background: "https://images.unsplash.com/photo-1507880572231-f85401ce76e6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=744e1c6d6e4de2332c93d168eb6b19f0&auto=format&fit=crop&w=1426&q=80" 
        }

    };

    if(!currConditionsList.hasOwnProperty(currentConditionType)){
        currentConditionType = "default";
    }

    $(".container").css({ "background": "url('" + currConditionsList[currentConditionType].background + "') no-repeat center center fixed", "background-size": "cover" });
    $("#weatherIcon").html("<i class='" + currConditionsList[currentConditionType].icon + "'></i>");
}

//Change the icons for the forecasted days
function getForecastIcons(forecasted){
    for (var i = 1; i <= 3; i++) {
        var iconCondition = forecasted[i].day.condition.text.toLowerCase();
        var forecastIcon;
        if(iconCondition.indexOf("sunny") > -1){
            forecastIcon = "wi wi-day-sunny";
        } else if (iconCondition.indexOf("fog") > -1 || iconCondition.indexOf("mist") > -1 || iconCondition.indexOf("overcast") > -1) {
            forecastIcon = "wi wi-fog";
        } else if (iconCondition.indexOf("rain") > -1 || iconCondition.indexOf("drizzle") > -1) {
            forecastIcon = "wi wi-rain";
        } else if (iconCondition.indexOf("cloud") > -1){
            forecastIcon = "wi wi-cloudy";
        } else if (iconCondition.indexOf("snow") > -1 || iconCondition.indexOf("blizzard") > -1){
            forecastIcon = "wi wi-snowflake-cold";
        } else if (iconCondition.indexOf("sleet") > -1){
            forecastIcon = "wi wi-sleet";
        } else if (iconCondition.indexOf("thunder") > -1) {
            forecastIcon = "wi wi-thunderstorm";
        } else if(iconCondition.indexOf("ice") > -1){
            forecastIcon = "wi wi-hail";
        } else {
            forecastIcon = "wi wi-cloud";
        }
        $("#icon" + i.toString()).html("<i class='" + forecastIcon + "'></i>");        
    }
}