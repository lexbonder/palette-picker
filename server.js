const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(bodyParser.json());

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = 'Palette Picker';

// Projects

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then( projects => {
      response.status(200).json(projects);
    })
    .catch( error => {
      response.status(500).json({error});
    })
});

app.post('/api/v1/projects', (request, response) => {
  const { name } = request.body;
  if (!name) {
    return response
      .status(422)
      .send({error: 'No project name provided'});
  }
  database('projects').insert({ name }, 'id')
    .then( project => {
      response.status(201).json({id: project[0]})
    })
    .catch( error => {
      response.status(500).json({ error })
    })
});

// Palettes

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then( palettes => {
      response.status(200).json(palettes);
    })
    .catch( error => {
      response.status(500).json({error});
    })
});

app.post('/api/v1/palettes', (request, response) => {
  const { newPalette } = request.body;

  for ( let requiredParameter of [
    'project_id', 'name', 'color1', 'color2',
    'color3', 'color4', 'color5'
  ]) {
    if (!newPalette[requiredParameter]) {
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

  database('palettes').insert(newPalette, 'id')
    .then( palette => {
      response.status(201).json({id: palette[0]});
    })
    .catch( error => {
      response.status(500).json({error});
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server is listening on ${app.get('port')}.`)
})