
exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert([
          {name: 'Project 1', id: 0},
          {name: 'Project 2', id: 1}
        ], 'id')
        .then(project => {
          return knex('palettes').insert([
            { 
              id: 0,
              project_id: project[0], name: 'Palette 1',
              color1: 'red', color2: 'blue',
              color3: 'green', color4: 'black',
              color5: 'white'
            },
            { 
              id: 1,
              project_id: project[0], name: 'Palette 2',
              color1: 'red', color2: 'blue',
              color3: 'green', color4: 'black',
              color5: 'white'
            },
            { 
              id: 2,
              project_id: project[1], name: 'Palette 3',
              color1: 'red', color2: 'blue',
              color3: 'green', color4: 'black',
              color5: 'white'
            }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
