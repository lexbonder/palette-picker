// Pulls in express
const express = require('express');
// Instantiates an express server and calls it app
const app = express();
// Allows the server to see and parse the content sent in the body of http requests
const bodyParser = require('body-parser');

// Finds the port supplied in the environment, or if undefined, 3000, and sets it to the variable 'port'
app.set('port', process.env.PORT || 3000);
// Acesses static files, html, css, and allows the server to send them to the client
app.use(express.static('public'));
// activates the bodyParser imported above
app.use(bodyParser.json());

// Determines the environment of the server, either whatever it recieves or 'development' by default
const environment = process.env.NODE_ENV || 'development';
// sets configuration as whatever environment is set to. corresponds to the keys in the knexfile.js
const configuration = require('./knexfile')[environment];
// sets the database along whatever configuration is set above
const database = require('knex')(configuration);

// sets the name of the app.locals table?
app.locals.title = 'Palette Picker';

// Projects

// listens for a get request to api/v1/projects
app.get('/api/v1/projects', (request, response) => {
  // grabs all columns from the 'projects' table
  database('projects').select()
    // takes those projects and...
    .then( projects => {
      // returns a response with a status of 200 (ok) and a parsed projects object
      response.status(200).json(projects);
    })
    // Listens for any errors and...
    .catch( error => {
      // throws an error if something goes wrong inside of the server (500)
      response.status(500).json({error});
    })
});

// listens for a post request to api/v1/projects
app.post('/api/v1/projects', (request, response) => {
  // creates variable 'name' from the content that was passed inside the http request body
  const { name } = request.body;
  // if there is no name
  if (!name) {
    // return a status of 422 (unprocessable entity) because a name parameter is required, sends error message
    return response
      .status(422)
      .send({error: 'No project name provided'});
  }
  // adds a row into the projects table, passing in the name and requesting the id back if sucessful
  database('projects').insert({ name }, 'id')
    // takes the project and...
    .then( project => {
      // returns a 201 (created) status, and gives the user an object with the new id, and the name
      response.status(201).json({id: project[0], name})
    })
    // listens for errors
    .catch( error => {
      // throws an error if something goes wrong inside of the server (500)
      response.status(500).json({ error })
    })
});

// Palettes

// listens for get requests to api/v1/palettes
app.get('/api/v1/palettes', (request, response) => {
  // gathers all rows from paletts table
  database('palettes').select()
    // takes those tables and...
    .then( palettes => {
      // returns a status of 200 (ok) and all of the palettes in an object
      response.status(200).json(palettes);
    })
    // listens for errors
    .catch( error => {
      // throws an error if something goes wrong inside of the server (500)
      response.status(500).json({error});
    })
});

// listens for post requests to api/v1/palettes
app.post('/api/v1/palettes', (request, response) => {
  // takes the entire request body and assigns it to newPalette
  const newPalette = request.body;
  // creates a variable 'requiredParameter' out of each item in the array
  for ( let requiredParameter of ['project_id', 'name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    // if a specific parameter is missing
    if (!newPalette[requiredParameter]) {
      // returns 422 (unprocessable entity) and a message specifying which paramer is missing
      return response
        .status(422)
        .send({ error: `Expected format: {
          project_id: <Integer>, name: <String>,
          color1: <String>, color2: <String>,
          color3: <String>, color4: <String>,
          color5: <String> }.
          You're missing ${requiredParameter}`})
    }
  }

  // adds a new row in the palettes table passing in the newPalette object and requesting back the id
  database('palettes').insert(newPalette, 'id')
    // takes the palette and...
    .then( palette => {
      // returns a status 201(created) along with the entire new palette object including the new id
      response.status(201).json({id: palette[0], ...newPalette});
    })
    // listens for errors
    .catch( error => {
      // throws an error if something goes wrong inside of the server (500)
      response.status(500).json({error});
    });
});

// listens for a delete request to a specific palette inside the palettes table by id
app.delete('/api/v1/palettes/:id', (request, response) => {
  // extracts the id from the request parameters
  const { id } = request.params;

  // dives into the palettes table, finds the row where the id matches the one from params, and deletes it
  database('palettes').where('id', id).del()
    // Responds with the number of rows effected by the delete
    .then( result => {)
      // if the number is greater than 0
      if (result) {
        // returns a 200(ok) and a message saying how many palettes were deleted sucessfully
        return response
          .status(200)
          .json({result: `${result} palette(s) deleted successfully.`})
      // if nothing gets deleted
      } else {
        // returns a 404 (not found) and a message saying the object cannot be found
        return response
          .status(404)
          .send({error: 'You cannot delete what does not exist.'})
      }
    })
    // listens for any errors
    .catch( error => {
      // throws an error if something goes wrong inside of the server (500)
      response.status(500).json({error})
    })
})

// tells the server to listen for whichever port is assigned above
app.listen(app.get('port'), () => {
  // Detailed message about which port the server is listening on
  console.log(`${app.locals.title} server is listening on ${app.get('port')}.`)
})

// exports the server for testing to import it
module.exports = app;