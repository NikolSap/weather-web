import express from 'express'
import axios from 'axios'
import bodyParser from "body-parser";

const API_URL = "http://api.openweathermap.org/";
const API_KEY = "e7c269427249b7defdf11ba417d8909d";

//http://api.openweathermap.org/geo/1.0/direct
//?q={city name},{state code},{country code}&limit={limit}&appid={API key}

//https://api.openweathermap.org/
//data/2.5/weather
//?lat={lat}&lon={lon}&appid={API key}

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const date = new Date();

const options = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
};

var dateStr = date.toLocaleString('en-IN', options);

app.get("/", (req, res) => {
    res.render("index.ejs");
})

var area="";
app.post("/", async(req, res) => {
 
  console.log(dateStr);

    if(req.body["area"])
    {
        console.log(req.body["area"])
        area = req.body["area"];
        area = area.charAt(0).toUpperCase() + area.slice(1,area.length);
        // res.render("index.ejs", {area: area, dateStr: dateStr});

    }

    try {

        const response = await axios.get(API_URL + "/geo/1.0/direct", {
            params: {
              q: req.body["area"],
              appid: API_KEY
            },
          });
        var lat=response.data[0].lat;
        var lon=response.data[0].lon;

       
        // var date= date.getDay();
        console.log("lat" , JSON.stringify(response.data[0].lat))
        try {

          console.log("enter")
            const response = await axios.get(API_URL + "data/2.5/weather", {
                params: {
                  lat: lat,
                  lon: lon,
                  appid : API_KEY
                },
              });

            const weatherIcon = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`;
            

            console.log(" data" , response.data)

           // api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid={API key}
           const Days5Response = await axios.get(API_URL + "data/2.5/forecast", {
            params: {
              lat: lat,
              lon: lon,
              appid: API_KEY
            },
          });
          const weatherIcon2 = `https://openweathermap.org/img/wn/${Days5Response.data.list[4].weather[0].icon}.png`;

            res.render("index.ejs", {data : response.data, area: area , dateStr: dateStr,
               icon:weatherIcon , Days5Data : Days5Response.data , icon2:weatherIcon2 });



        } catch (error) {
            console.log(error);
            // res.status(500);
         
        }
        } catch (error) {
           // console.log(error);
            // res.status(500);
         
        }
    });
 


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });