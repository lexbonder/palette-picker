const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(bodyParser.json());

app.locals.title = 'Palette Picker';

// Projects

app.locals.projects = [
  {id: 0, name: 'Project 1'},
  {id: 1, name: 'Project 2'}
]

app.get('/api/v1/projects', (request, response) => {
  response.status(200).json(app.locals.projects);
})

app.post('/api/v1/projects', (request, response) => {
  const { name } = request.body;
  if (!name) {
    return response.status(422).send({error: 'No project name provided'});
  } else {
    const newProject = {id: Date.now(), name}
    app.locals.projects.push(newProject)
    return response.status(201).json(newProject)
  }
})

// Palettes

app.locals.palettes = [
  { 
    id: 0, 
    projectId: 0, 
    name: 'Palette 1',  
    color1: '#133760', 
    color2: '#6152A2',
    color3: '#79A8D7',
    color4: '#A8C3C8',
    color5: '#FCE5A3'
  },
  { 
    id: 1,
    projectId: 0,
    name: 'Warm Combo', 
    color1: '#C03A31', 
    color2: '#5E0E07',
    color3: '#F39C39',
    color4: '#B87F9E',
    color5: '#DDDDDD'
  },
  { 
    id: 2,
    projectId: 1,
    name: 'Nature', 
    color1: '#469A30', 
    color2: '#BDD5AC',
    color3: '#314C1C',
    color4: '#FCE5A3',
    color5: '#7FA4AE'
  }
]

app.get('/api/v1/palettes', (request, response) => {
  response.status(200).json(app.locals.palettes);
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server is listening on ${app.get('port')}.`)
})