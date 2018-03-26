
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);

chai.use(chaiHttp);

  before(() => {
    return database.migrate.latest()
  })

  beforeEach(() => {
    return database.seed.run();
  })

describe('API Routes', () => {
  describe('Projects', () => {
    describe('GET /api/v1/projects', () => {
      it('should return all projects', () => {
        return chai.request(server)
          .get('/api/v1/projects')
          .then(response => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.an('array');
            response.body.length.should.equal(2);
            response.body[0].should.have.property('id');
            response.body[0].id.should.equal(0);
            response.body[0].should.have.property('name');
            response.body[0].name.should.equal('Project 1');
          })
          .catch( error => {
            throw error;
          });
      });
    });

    describe('POST /api/v1/projects', () => {
      it('should create a new project', () => {
        return chai.request(server)
          .post('/api/v1/projects')
          .send({
            name: 'newProject'
          })
          .then( response => {
            response.should.have.status(201);
            response.body.should.be.an('object');
            response.body.should.have.property('id');
            response.body.should.have.property('name');
            response.body.name.should.equal('newProject');
          })
          .catch( error => {
            throw error;
          });
      });

      it('should not create a new project without a name', () => {
        return chai.request(server)
          .post('/api/v1/projects')
          .send({
            // name: 'newProject'
          })
          .then( response => {
            response.should.have.status(422);
            response.body.error.should.equal('No project name provided');
          })
          .catch( error => {
            throw error;
          });
      });
    });
  });

  describe('Palettes', () => {
    describe('GET /api/v1/palettes', () => {
      it('should return all palettes', () => {
        return chai.request(server)
          .get('/api/v1/palettes')
          .then( response => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.an('array');
            response.body.length.should.equal(3);
            response.body[0].should.have.property('id');
            response.body[0].id.should.equal(0);
            response.body[0].should.have.property('project_id');
            response.body[0].project_id.should.equal(0);
            response.body[0].should.have.property('name');
            response.body[0].name.should.equal('Palette 1');
            response.body[0].should.have.property('color1');
            response.body[0].color1.should.equal('red');
            response.body[0].should.have.property('color2');
            response.body[0].color2.should.equal('blue');
            response.body[0].should.have.property('color3');
            response.body[0].color3.should.equal('green');
            response.body[0].should.have.property('color4');
            response.body[0].color4.should.equal('black');
            response.body[0].should.have.property('color5');
            response.body[0].color5.should.equal('white');
          })
          .catch( error => {
            throw error;
          });
      });
    });

    describe('POST /api/v1/palettes', () => {
      it('should create a new palette', async () => {
        return chai.request(server)
          .post('/api/v1/palettes')
          .send({
            id: 5,
            project_id: 1,
            name: 'newPalette',
            color1: 'purple',
            color2: 'purple',
            color3: 'purple',
            color4: 'purple',
            color5: 'purple'
          })
          .then( response => {
            response.should.have.status(201);
            response.body.should.be.an('object');
            response.body.should.have.property('id');
            response.body.id.should.equal(5);
            response.body.should.have.property('name');
            response.body.name.should.equal('newPalette');
            response.body.should.have.property('color1');
            response.body.color1.should.equal('purple');
            response.body.should.have.property('color2');
            response.body.color2.should.equal('purple');
            response.body.should.have.property('color3');
            response.body.color3.should.equal('purple');
            response.body.should.have.property('color4');
            response.body.color4.should.equal('purple');
            response.body.should.have.property('color5');
            response.body.color5.should.equal('purple');
          })
          .catch( error => {
            throw error;
          });
      });

      it('should not create a palette if a paramter is missing and alerts the user of which parameter it needs', () => {
        return chai.request(server)
          .post('/api/v1/palettes')
          .send({
            id: 6,
            // project_id: 1,
            name: 'newPalette',
            color1: 'purple',
            color2: 'purple',
            color3: 'purple',
            color4: 'purple',
            color5: 'purple'
          })
          .then( response => {
            response.should.have.status(422);
            response.body.error.should.equal('Expected format: {\n          project_id: <Integer>, name: <String>,\n          color1: <String>, color2: <String>,\n          color3: <String>, color4: <String>,\n          color5: <String> }.\n          You\'re missing project_id');
          });
      });
    });

    describe('DELETE /api/v1/palettes/:id', () => {
      it('should remove a palette from the database', () => {
        return chai.request(server)
          .delete('/api/v1/palettes/0')
          .then( response => {
            response.should.have.status(200);
            response.body.result.should.equal('1 palette(s) deleted successfully.');
          })
          .catch( error => {
            throw error;
          });
      });

      it('should not remove a paleete and throw an error if the palette doesn\'t exist', () => {
        return chai.request(server)
          .delete('/api/v1/palettes/99')
          .then( response => {
            response.should.have.status(404);
            response.body.error.should.equal('You cannot delete what does not exist.')
          })
      })
    })
  });
});