/* Global Variables */
const generate = document.querySelector("#generate");
const zip = document.querySelector("#zip");
const feeling = document.querySelector("#content");
const temp = document.querySelector("#temp");
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=4d9a13210642a3c0cb509d937072babf&units=imperial';
const myDate = document.querySelector("#myDate");
const weather = document.querySelector("#weather");
const entry = document.querySelector("#entryHolder");
const errInput = document.querySelector("#error");
const name = document.querySelector("#name");

// Create a new date instance dynamically with JS
//this creates the date better and easier
let d = new Date();
const date = d.toDateString();

//click event listener for the generate button
generate.addEventListener("click", (e) =>{
    e.preventDefault();//prevent the form defaults
    const madeURL = `${baseURL}${zip.value}${apiKey}`;//url generator
    getData(madeURL)//gathers the data from the open weather api
    .then ((data) => {
        extractData(data)//function that takes only the desired data from the chunck of data gotten
        .then ((info) =>{
            postData("/add", info) //it stringift the data and converts it to a json file and push it to the server
            .then (()=>{
                returnData("/all")//gets data from the server
                .then((data)=>{
                    updateUI(data);//updates the browser with the data without reload
                })
            })
        })
    });
});

//async function that gathers the data from the open weather api
const getData = async (url) => {
    try{
        const result = await fetch(url);
        const data = await result.json();
        if (data.cod == 200){
        return(data);
        } 
    }
    catch(err){
        console.log("Error found : "+err);        
    }
}
//async function that takes only the desired data from the chunck of data gotten
const extractData = async (data) => {
    await data;
    try {
        if (data)
        {
            const icon = data.weather[0].icon;
            const info = {
                date : date,
                feelings : feelings.value,
                temperature : data.main.temp+"°c",
                weather : data.weather[0].description,
                icon : icon,
                name : data.name
            }
                  return (info);
        }
        else{
            return data;
          };
}
catch(err){
    console.log("Error found"+err);
}};

//async function that stringify the data and converts it to a json file and push it to the server
const postData = async(url = "", data={})=>{
    try {
        const value = await fetch(url, {
            method: "POST",
        credentials: "same-origin",
    headers: {
        "content-Type": "application/json"
    },
    body: JSON.stringify(data)})
    return value;
}
    catch(err){
        console.log("error found "+err)
    }
}

//async function that get data back from the server
const returnData = async (url)=> {
    const data = await fetch(url);
    try{
        const res = await data.json();
       return res;
    }
    catch(err){
        console.log("error found "+ err);
    }
}

//async function that updates the browser with the data without reload
const updateUI = async (data) => {
    try {
    const response = await data;
    if (response.date)
    {
        entry.style.display = "block";
        const icon = response.icon;
        myDate.innerHTML = "Date : "+response.date+" .";
        temp.innerHTML = "Temperature : "+response.temperature+" .";
        feeling.innerHTML = response.feelings;
        weather.innerHTML = "Weather Description : "+response.weather+" .";
        name.innerHTML = "Country Name : " + response.name;
        errInput.style.display = "none";
        backGround(icon);//it changes the background image in respect to the data collect
    }else{
        errInput.style.display = "block";
        errInput.innerHTML="Input error .... Check zip code and try again !!!";
        entry.style.display = "none";
    }
    }
    catch(err){
        console.log("error : "+ err);
    }
}

//async function that changes the background image in respect to the data collect
const backGround = async (icon) => {
    await icon;
    if (icon == "03d" || icon == "04d" || icon == "03n" || icon == "04n"){
        let sky = document.querySelector("body");
        sky.style.backgroundImage = "url('cloud2.jpg')";
        sky.style.backgroundRepeat = "no-repeat";
        sky.style.backgroundSize = "cover";
    }
    else if (icon == "09d" || icon == "10d" || icon == "09n" || icon == "10n") {
        let sky = document.querySelector("body");
        sky.style.backgroundImage = "url('rain2.jpg')";
        sky.style.backgroundRepeat = "no-repeat";
        sky.style.backgroundSize = "cover";
        sky.style.color = "white";
        document.querySelector("#app").classList.remove = "smug";
    } 
    else if (icon == "11d" || icon == "11n") {
        let sky = document.querySelector("body");
        sky.style.backgroundImage = "url('thunder3.jpg')";
        sky.style.backgroundRepeat = "no-repeat";
        sky.style.backgroundSize = "cover";
    }
    else if (icon == "13d" || icon == "13n") {
        let sky = document.querySelector("body");
        sky.style.backgroundImage = "url('snow.jpg')";
        sky.style.backgroundRepeat = "no-repeat";
        sky.style.backgroundSize = "cover";
    }
    else if(icon == "50d" || icon == "50n"){
        let sky = document.querySelector("body");
        sky.style.backgroundImage = "url('mist.jpg')";
        sky.style.backgroundRepeat = "no-repeat";
        sky.style.backgroundSize = "cover";    
    } else {
        let sky = document.querySelector("body");
        sky.style.backgroundImage = "url('clear2.jpg')";
        sky.style.backgroundRepeat = "no-repeat";
        sky.style.backgroundSize = "cover";
    }
}