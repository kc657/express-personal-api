// require express and other modules
let express = require('express'),
  app = express()

// database
let db = require('./models')

// parse incoming urlencoded form data
// and populate the req.body object
let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

// allow cross origin requests (optional)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

/************
 * DATABASE *
 ************/

// let db = require('./models');

/**********
 * ROUTES *
 **********/

// Serve static files from the `/public` directory:
// i.e. `/images`, `/scripts`, `/styles`
app.use(express.static('public'))

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})

/*
 * JSON API Endpoints
 */

app.get('/api/cities', function (req, res) {
  db.Cities.find().populate().exec(function (err, city) {
    if (err) {
      console.log('Error listing all cities')
    }
    res.json(city)
  })
})

app.get('/api/cities/:name', function (req, res) {
  let searchCity = req.params.name
  db.Cities.findOne({name: searchCity}, function (err, cityName) {
    res.json(cityName)
  })
})

app.get('/api/cities/:id', function (req, res) {
  let searchCity = req.params.id
  db.Cities.findOne({_id: searchCity}, function (err, cityName) {
    res.json(cityName)
  })
})

app.post('/api/cities', function (req, res) {
  let newCity = new db.Cities({
    name: req.body.name,
    lat: req.body.lat,
    long: req.body.long
  })
  db.Cities.create({name: req.body.name, lat: req.body.lat, long: req.body.long, alive: true}, function (err, newCity) {
  })
  res.json(newCity)
})

var thisCity = require('./models/cities')

app.put('/api/cities/:id', function (req, res) {
  db.Cities.findById(req.params.id, function (err, updateCity) {
    if (err) {
      console.log('error')
      return err
    } else {
      updateCity.name = req.body.name || updateCity.name
      updateCity.lat = req.body.lat || updateCity.lat
      updateCity.long = req.body.long || updateCity.long

      updateCity.save(function (err, updateCity) {
        if (err) {
          res.status(500).send(err)
        }
        res.send(updateCity)
      })
    }
  })
})

app.delete('/api/cities/:id', function (req, res) {
  console.log('deleting city ', req.params)
  selectedCity = req.params.id
  db.Cities.findOneAndRemove({_id: selectedCity }).exec(function (err, deletedCity) { res.json(deletedCity) })
})

 // Hardcoded
app.get('/api', function apiIndex (req, res) {
  // TODO: Document all your api endpoints below as a simple hardcoded JSON object.
  // It would be seriously overkill to save any of this to your database.
  // But you should change almost every line of this response.
  res.json({
    DocumentAllMyEndpoints: true, // CHANGE ME ;)
    message: "Welcome to my personal api! Here's what you need to know!",
    personalProfile: '/api/profile',
    documentationUrl: 'https://github.com/kc657/express-personal-api/blob/master/README.md', // CHANGE ME
    baseUrl: 'https://stormy-retreat-15109.herokuapp.com', // CHANGE ME
    endpoints: [
      {method: 'GET', path: '/api', description: 'Describes all available endpoints'},
      {method: 'GET', path: '/api/profile', description: 'Data about me'}, // CHANGE ME
      {method: 'GET', path: '/api/cities', description: 'List of all the cities'},
      {method: 'GET', path: '/api/cities/:name', description: 'Find one city by city name'},
      {method: 'GET', path: '/api/cities/:id', description: 'Find one city by id number'},
      {method: 'POST', path: '/api/cities', description: 'Create a new city'}, // CHANGE ME
      {method: 'PUT', path: '/api/cities/:id', description: 'Update one city by city id'},
      {method: 'DELETE', path: '/api/cities/:id', description: 'Delete one city by city id'},
    ]
  })
})

app.get('/api/profile', function apiIndex (req, res) {
  res.json({
    message: 'Welcome to my personal profile!',
    fullName: 'Kevin Chen',
    email: 'kvn.0218@gmail.com',
    githubUsername: 'kc657',
    githubURL: 'https://github.com/kc657/',
    githubPhoto: 'https://avatars3.githubusercontent.com/u/8884804?v=4&s=400',
    currentCity: 'San Francisco',
    previousCities: [
      {cityName: 'Chicago',
        years: 1 },
      {cityName: 'Taipei',
        years: 4 },
      {cityName: 'New York',
        years: 4 },
      {cityName: 'London',
        years: 2 },
      {cityName: 'Shanghai',
        years: 7 },
      {cityName: 'Hong Kong',
        years: 4 }
    ],
    pets: [
      {dogs: [
        {name: 'Chloe',
          breed: 'Pug',
          age: 2,
          intelligence: null,
          altruistic: false,
          adorable: true,
          annoying: true,
          alive: true
        },
        {name: 'Richard',
          breed: 'Schnauzer',
          age: 13,
          intelligence: null,
          altruistic: true,
          adorable: true,
          annoying: false,
          alive: false
        }
      ]},
      {fish: [
        {name: 1,
          alive: false},
        {name: 2,
          alive: false},
        {name: 3,
          alive: false},
        {name: 4,
          alive: false},
        {name: 5,
          alive: false},
        {name: 6,
          alive: false},
        {name: 7,
          alive: false},
        {name: 8,
          alive: false},
        {name: 9,
          alive: false},
        'and so on...'
      ]}
    ]
  })
})

/**********
 * SERVER *
 **********/

// listen on the port that Heroku prescribes (process.env.PORT) OR port 3000
app.listen(process.env.PORT || 3000)
