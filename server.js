const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = 'Palette Picker';

const requireHTTPS = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
    next();
};

if (process.env.NODE_ENV === 'production') { app.use(requireHTTPS); }

app.use(express.static('public'));

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

  database('projects').where('name', name).select()
    .then(result => {
      if (result.length) {
        return response
          .status(400)
          .send({error: 'That project name already exists'});
      } else {
        database('projects').insert({ name }, 'id')
          .then( project => {
            response.status(201).json({id: project[0], name});
          })
          .catch( error => {
            response.status(500).json({ error });
          });
      }
    })
    .catch( error => {
      response.status(500).json({ error });
    });

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
  const newPalette = request.body;
  for ( let requiredParameter of ['project_id', 'name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
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
      response.status(201).json({id: palette[0], ...newPalette});
    })
    .catch( error => {
      response.status(500).json({error});
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where('id', id).del()
    .then( result => {
      if (result) {
        return response
          .status(200)
          .json({result: `${result} palette(s) deleted successfully.`})
      } else {
        return response
          .status(404)
          .send({error: 'You cannot delete what does not exist.'})
      }
    })
    .catch( error => {
      response.status(500).json({error})
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server is listening on ${app.get('port')}.`)
})

module.exports = app;