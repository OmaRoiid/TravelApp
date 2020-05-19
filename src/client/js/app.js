//Vars
const geonamesBASEURL="http://api.geonames.org/searchJSON?q=";
const geonamesUserName="omarsalem977";
const pixabayBASEURL = "https://pixabay.com/api/?key=";
const pixabayKey="16597249-bea988a31865a48b462e9f96f";
const weatherbitBASEURL="https://api.weatherbit.io/v2.0/current?"
const weatherbitKey="174474f9538f4b58bfc6303fd28ca4a7"
const result = document.querySelector("#result");
const timestampNow = (Date.now()) / 1000;
const form = document.querySelector("#form");
const leavingFrom = document.querySelector('input[name="from"]');
const goingTo = document.querySelector('input[name="to"]');
const depDate = document.querySelector('input[name="date"]');
const trip = document.querySelector("#trip");
const addTripButton = document.querySelector(".map__link");
const printButton = document.querySelector("#save");
const deleteButton = document.querySelector("#delete");
const sections =document.querySelectorAll('section');

//Event Lisnters
// add trip button
const addTripEvList = addTripButton.addEventListener('click', function (e) {
    e.preventDefault();
    trip.scrollIntoView({ behavior: 'smooth' });
  })

// submit event
form.addEventListener('submit', addTrip);

// print button
printButton.addEventListener('click', function (e) {
  window.print();
  location.reload();
});
// delete button
deleteButton.addEventListener('click', function (e) {
  form.reset();
  result.classList.add("delete");
  location.reload();
})
export function addTrip(e) {
  e.preventDefault();
  //Acquiring and storing user trip data
  const leavingFromText = leavingFrom.value;
  const goingToText = goingTo.value;
  const depDateText = depDate.value;
  const timestamp = (new Date(depDateText).getTime()) / 1000;

  // function checkInput to validate input 
  Client.checkInput(leavingFromText, goingToText);

  getCityInfo(geonamesBASEURL, goingToText, geonamesUserName)
    .then((cityData) => {
      const cityLat = cityData.geonames[0].lat;
      const cityLong = cityData.geonames[0].lng;
      const country = cityData.geonames[0].countryName;
      const weatherData = getWeather(cityLat, cityLong)
      return weatherData;
    })
    .then((weatherData) => {
      const daysLeft = Math.round((timestamp - timestampNow) / 86400);
      const userData = postData('http://localhost:5050/add', { leavingFromText, goingToText, depDateText, weather: weatherData.data[0].temp, daysLeft });
      return userData;
    }).then((userData) => {
      updateUI(userData);
    })
}
export const getCityInfo = async (geonamesBASEURL, goingToText, geonamesUserName) => {
  // res equals to the result of fetch function
  const res = await fetch(geonamesBASEURL + goingToText + "&maxRows=10&" + "username="+ geonamesUserName);
  try {
    const cityData = await res.json();
    return cityData;
  } catch (error) {
    console.log("error", error);
  }
};
// function getWeather to get weather information from Dark Sky API 
export const getWeather = async (cityLat, cityLong) => {
  const req = await fetch(weatherbitBASEURL+"lat="+ cityLat +"&lon="+ cityLong +"&key="+ weatherbitKey);
  try {
    const weatherData = await req.json();
    return weatherData;
  } catch (error) {
    console.log("error", error);
  }
}
// Function postData to POST data to our local server
export const postData = async (url = '', data = {}) => {
  const req = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify({
      depCity: data.leavingFromText,
      arrCity: data.goingToText,
      depDate: data.depDateText,
      weather: data.weather,
      summary: data.summary,
      daysLeft: data.daysLeft
    })
  })
  try {
    const userData = await req.json();
    return userData;
  } catch (error) {
    console.log("error", error);
  }
}
export const updateUI = async (userData) => {
  result.classList.remove("delete");
  result.scrollIntoView({ behavior: "smooth" });
  const res = await fetch(pixabayBASEURL + pixabayKey + "&q="+ userData.arrCity + "+city&image_type=photo");

  try {
    const imageLink = await res.json();
    const dateSplit = userData.depDate.split("-").reverse().join(" / ");
    document.querySelector("#city").innerHTML = userData.arrCity;
    document.querySelector("#date").innerHTML = dateSplit;
    document.querySelector("#days").innerHTML = userData.daysLeft;
    document.querySelector("#temp").innerHTML = userData.weather;
    document.querySelector("#fromPixabay").setAttribute('src', imageLink.hits[0].webformatURL);
  }
  catch (error) {
    console.log("error", error);
  }
}
export { addTripEvList }

  // Activation sections while scrolling 
  window.addEventListener('scroll', function (event)  {
    sections.forEach(el=>{
      const navLink = document.querySelector( `a[href="#${el.getAttribute("id")}"]`);
      if(isInViewport(el)){
          el.classList.add("active")
    }
    else {
      el.classList.remove("active");
    }
  })
    })
    ///* Determining if element is in viewport */ 
var isInViewport = function (el) {
	var distance = el.getBoundingClientRect();
	return (
		distance.top >= 0 &&
		distance.left >= 0 &&
		distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		distance.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}
  // Hide and Show Navbar while scrolling 
  var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-100px";
  }
  prevScrollpos = currentScrollPos;
}

