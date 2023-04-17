// API key = f1c1596d893e511ad9025d6219cdcf32
var main = document.querySelector("#main");
var searchCity = document.querySelector("#cityInput");
var searchHistory = document.querySelector("#search-history");
var userForm = document.querySelector("#user-form");
var btnSearch = document.querySelector(".btn-primary");
var currentWeather = document.querySelector("#currentWeather");
var forecastDay1 = document.querySelector("#day1");
var forecastDay2 = document.querySelector("#day2");
var forecastDay3 = document.querySelector("#day3");
var forecastDay4 = document.querySelector("#day4");
var forecastDay5 = document.querySelector("#day5");


var APIKey = "f1c1596d893e511ad9025d6219cdcf32";

// Hide content before click EventListener
main.style.display = "none";

// get items from localstorage and create each element button from the inputed city
function loadHistory() {
    searchHistory.innerHTML = "";

    var getItem = localStorage.getItem("history");
    var getItemParsed = JSON.parse(getItem) || [];

    for (var i = 0; i < getItemParsed.length; i++) {
        var elementSaved = getItemParsed[i];
        var savedBtn = document.createElement("button");
        savedBtn.textContent = elementSaved;
        savedBtn.setAttribute("button-history", elementSaved);
        searchHistory.appendChild(savedBtn);
    }
}

// Function loads history when page opens
loadHistory();

// Click event to clear the previous content and call function searchWeather
btnSearch.addEventListener("click", function (event) {
    event.preventDefault();
    currentWeather.innerHTML = "";
    toggleMain(false);

    var city = searchCity.value.trim();
    searchCity.value = "";
    searchWeather(city);
});

searchHistory.addEventListener("click", function (event) {
    currentWeather.innerHTML = "";
    var options = event.target.getAttribute("button-history");
    searchWeather(options);
});


function searchWeather(city) {
    forecastDay1.innerHTML = "";
    forecastDay2.innerHTML = "";
    forecastDay3.innerHTML = "";
    forecastDay4.innerHTML = "";
    forecastDay5.innerHTML = "";

    var coordinatesAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}&units=imperial`;
    fetch(coordinatesAPI).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var coordinateLat = data[0].lat;
                var coordinateLon = data[0].lon;
                historyCities(city); // JSON info from local Storage
                loadHistory(); // get items from localstorage and create each element button from the inputed seach city
                weather(coordinateLat, coordinateLon, city); // The API uses the coordinates to get the current weather details; coordinateLat, coordinateLon, city from function above
                forecast(coordinateLat, coordinateLon); // 5 day forecast
            });
        } else {
            alert("Error Please Enter a Valid City Name");
        }
    });
}

// The API uses the coordinates to get the current weather using Lat and Lon
var weather = function (lat, lon, city) {
    var weatherDataAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
    fetch(weatherDataAPI).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                toggleMain(true);

                // Created a div element and Append the div to the currentWeather element
                var currentDiv = document.createElement("div");
                currentDiv.className = "current-div";
                currentWeather.appendChild(currentDiv);

                // Todays date
                var rightNow = dayjs().format("(M/DD/YYYY)");
                var cityName = document.createElement("h2");
                cityName.textContent = "City: " + city + " " + rightNow;
                currentDiv.appendChild(cityName);

                // Weather icon
                var weatherCode = data.weather[0].icon;
                var iconUrl = `https://openweathermap.org/img/w/${weatherCode}.png`;
                var iconElement = document.createElement("img");
                iconElement.src = iconUrl;
                currentDiv.appendChild(iconElement);

                // Weather for current day
                var temp = document.createElement("p");
                temp.textContent = "Temp: " + data.main.temp + "°F";
                currentWeather.appendChild(temp);

                var feelsLike = document.createElement("p");
                feelsLike.textContent = "Feels Like: " + data.main.feels_like + "°F";
                currentWeather.appendChild(feelsLike);

                var wind = document.createElement("p");
                wind.textContent = "Wind: " + data.wind.speed + "mph";
                currentWeather.appendChild(wind);

                var humididy = document.createElement("p");
                humididy.textContent = "Humidity: " + data.main.humidity + "%";
                currentWeather.appendChild(humididy);
            });
        }
    });
};

// 5 day weather forecast data
var forecast = function (lat, lon) {
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
    fetch(forecastURL)
        .then((response) => response.json())
        .then((data) => {
            var dailyData = data.list.filter((dataPoint) =>
                dataPoint.dt_txt.endsWith("12:00:00")
            );

            // Forecast day 1
            var forecastDate = document.createElement("h4");
            var date = dayjs().add(1, "day").format("(M/DD/YYYY)");
            forecastDate.textContent = date;
            forecastDay1.appendChild(forecastDate);

            var elementIcon = dailyData[0].weather[0].icon;
            var iconURL = `https://openweathermap.org/img/w/${elementIcon}.png`;
            var forecastIcon = document.createElement("img");
            forecastIcon.src = iconURL;
            forecastDay1.appendChild(forecastIcon);

            var elementTemp = dailyData[0].main.temp;
            var forecastTemp = document.createElement("p");
            forecastTemp.textContent = "Temp: " + elementTemp + "°F";
            forecastDay1.appendChild(forecastTemp);

            var elementFeelsLike = dailyData[0].main.feels_like;
            var forecastFeels = document.createElement("p");
            forecastFeels.textContent = "Feels Like: " + elementFeelsLike + "°F";
            forecastDay1.appendChild(forecastFeels);

            var elementWind = dailyData[0].wind.speed;
            var forecastWind = document.createElement("p");
            forecastWind.textContent = "Wind: " + elementWind + "mph";
            forecastDay1.appendChild(forecastWind);

            var elementHumidity = dailyData[0].main.humidity;
            var forecastHumidity = document.createElement("p");
            forecastHumidity.textContent = "Humidity: " + elementHumidity + "%";
            forecastDay1.appendChild(forecastHumidity);

            // Forecast day 2
            var forecastDate2 = document.createElement("h4");
            var date2 = dayjs().add(2, "day").format("(M/DD/YYYY)");
            forecastDate2.textContent = date2;
            forecastDay2.appendChild(forecastDate2);

            var elementIcon2 = dailyData[1].weather[0].icon;
            var iconURL2 = `https://openweathermap.org/img/w/${elementIcon2}.png`;
            var forecastIcon2 = document.createElement("img");
            forecastIcon2.src = iconURL2;
            forecastDay2.appendChild(forecastIcon2);

            var elementTemp2 = dailyData[1].main.temp;
            var forecastTemp2 = document.createElement("p");
            forecastTemp2.textContent = "Temp: " + elementTemp2 + "°F";
            forecastDay2.appendChild(forecastTemp2);

            var elementFeelsLike2 = dailyData[1].main.feels_like;
            var forecastFeels2 = document.createElement("p");
            forecastFeels2.textContent = "Feels Like: " + elementFeelsLike2 + "°F";
            forecastDay2.appendChild(forecastFeels2);

            var elementWind2 = dailyData[1].wind.speed;
            var forecastWind2 = document.createElement("p");
            forecastWind2.textContent = "Wind: " + elementWind2 + "mph";
            forecastDay2.appendChild(forecastWind2);

            var elementHumidity2 = dailyData[1].main.humidity;
            var forecastHumidity2 = document.createElement("p");
            forecastHumidity2.textContent = "Humidity: " + elementHumidity2 + "%";
            forecastDay2.appendChild(forecastHumidity2);

            // Forecast day 3
            var forecastDate3 = document.createElement("h4");
            var date3 = dayjs().add(3, "day").format("(M/DD/YYYY)");
            forecastDate3.textContent = date3;
            forecastDay3.appendChild(forecastDate3);

            var elementIcon3 = dailyData[2].weather[0].icon;
            var iconURL3 = `https://openweathermap.org/img/w/${elementIcon3}.png`;
            var forecastIcon3 = document.createElement("img");
            forecastIcon3.src = iconURL3;
            forecastDay3.appendChild(forecastIcon3);

            var elementTemp3 = dailyData[2].main.temp;
            var forecastTemp3 = document.createElement("p");
            forecastTemp3.textContent = "Temp: " + elementTemp3 + "°F";
            forecastDay3.appendChild(forecastTemp3);

            var elementFeelsLike3 = dailyData[2].main.feels_like;
            var forecastFeels3 = document.createElement("p");
            forecastFeels3.textContent = "Feels Like: " + elementFeelsLike3 + "°F";
            forecastDay3.appendChild(forecastFeels3);

            var elementWind3 = dailyData[2].wind.speed;
            var forecastWind3 = document.createElement("p");
            forecastWind3.textContent = "Wind: " + elementWind3 + "mph";
            forecastDay3.appendChild(forecastWind3);

            var elementHumidity3 = dailyData[2].main.humidity;
            var forecastHumidity3 = document.createElement("p");
            forecastHumidity3.textContent = "Humidity: " + elementHumidity3 + "%";
            forecastDay3.appendChild(forecastHumidity3);

            // Forecast day 4
            var forecastDate4 = document.createElement("h4");
            var date4 = dayjs().add(4, "day").format("(M/DD/YYYY)");
            forecastDate4.textContent = date4;
            forecastDay4.appendChild(forecastDate4);

            var elementIcon4 = dailyData[3].weather[0].icon;
            var iconURL4 = `https://openweathermap.org/img/w/${elementIcon4}.png`;
            var forecastIcon4 = document.createElement("img");
            forecastIcon4.src = iconURL4;
            forecastDay4.appendChild(forecastIcon4);

            var elementTemp4 = dailyData[3].main.temp;
            var forecastTemp4 = document.createElement("p");
            forecastTemp4.textContent = "Temp: " + elementTemp4 + "°F";
            forecastDay4.appendChild(forecastTemp4);

            var elementFeelsLike4 = dailyData[3].main.feels_like;
            var forecastFeels4 = document.createElement("p");
            forecastFeels4.textContent = "Feels Like: " + elementFeelsLike4 + "°F";
            forecastDay4.appendChild(forecastFeels4);

            var elementWind4 = dailyData[3].wind.speed;
            var forecastWind4 = document.createElement("p");
            forecastWind4.textContent = "Wind: " + elementWind4 + "mph";
            forecastDay4.appendChild(forecastWind4);

            var elementHumidity4 = dailyData[3].main.humidity;
            var forecastHumidity4 = document.createElement("p");
            forecastHumidity4.textContent = "Humidity: " + elementHumidity4 + "%";
            forecastDay4.appendChild(forecastHumidity4);

            // Forecast day 5
            var forecastDate5 = document.createElement("h4");
            var date5 = dayjs().add(5, "day").format("(M/DD/YYYY)");
            forecastDate5.textContent = date5;
            forecastDay5.appendChild(forecastDate5);

            var elementIcon5 = dailyData[4].weather[0].icon;
            var iconURL5 = `https://openweathermap.org/img/w/${elementIcon5}.png`;
            var forecastIcon5 = document.createElement("img");
            forecastIcon5.src = iconURL5;
            forecastDay5.appendChild(forecastIcon5);

            var elementTemp5 = dailyData[4].main.temp;
            var forecastTemp5 = document.createElement("p");
            forecastTemp5.textContent = "Temp: " + elementTemp5 + "°F";
            forecastDay5.appendChild(forecastTemp5);

            var elementFeelsLike5 = dailyData[4].main.feels_like;
            var forecastFeels5 = document.createElement("p");
            forecastFeels5.textContent = "Feels Like: " + elementFeelsLike5 + "°F";
            forecastDay5.appendChild(forecastFeels5);

            var elementWind5 = dailyData[4].wind.speed;
            var forecastWind5 = document.createElement("p");
            forecastWind5.textContent = "Wind: " + elementWind5 + "mph";
            forecastDay5.appendChild(forecastWind5);

            var elementHumidity5 = dailyData[4].main.humidity;
            var forecastHumidity5 = document.createElement("p");
            forecastHumidity5.textContent = "Humidity: " + elementHumidity5 + "%";
            forecastDay5.appendChild(forecastHumidity5);
        });
};

// Hide and show the main content
function toggleMain(value) {
    if (value === true) {
        main.style.display = "flex";
    } else {
        main.style.display = "none";
    }
}

// using JSON for info from local Storage
var historyCities = function (city) {
    var getItem = localStorage.getItem("history");
    var getItemParse = JSON.parse(getItem) || [];
    getItemParse.push(city);
    var getItemStringfy = JSON.stringify(getItemParse);

    localStorage.setItem("history", getItemStringfy);
};
