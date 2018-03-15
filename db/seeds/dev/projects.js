
exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert([
          {name: 'Project 1'},
          {name: 'Project 2'}
        ], 'id')
        .then(project => {
          return knex('palettes').insert([
            { 
              project_id: project[0], name: 'Palette 1',
              color1: '#133760', color2: '#6152A2',
              color3: '#79A8D7', color4: '#A8C3C8',
              color5: '#FCE5A3'
            },
            { 
              project_id: project[0], name: 'Warm Combo',
              color1: '#C03A31', color2: '#5E0E07',
              color3: '#F39C39', color4: '#B87F9E',
              color5: '#DDDDDD'
            },
            { 
              project_id: project[1], name: 'Nature',
              color1: '#469A30', color2: '#BDD5AC',
              color3: '#314C1C', color4: '#FCE5A3',
              color5: '#7FA4AE'
            }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
