
const getRandomColor = () => {
  letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

const getRandomPalette = () => {
  const palette = {}
  for (let i = 1; i <= 5; i++) {
    const randomColor = getRandomColor()
    palette[`color${i}`] = randomColor;
  }
  return palette;
}

const setMainPalette = () => {
  const mainPalette = getRandomPalette()
  for (let i = 1; i <= 5; i++) {
    //if // !hasclass locked --> 
    $(`.main-palette-slide${i}`).css('background-color', mainPalette[`color${i}`]);
    $(`.main-palette-hex${i}`).text(mainPalette[`color${i}`]);
  }
}

const getProjects = async () => {
  const initialFetch = await fetch('http://localhost:3000/api/v1/projects');
  const projects = await initialFetch.json();
  projects.forEach(project => renderProject(project));
}

const renderProject = project => {
  $('select').append(`<option value="${project.id}">${project.name}</option>`);
  $('.project-wrapper').append(`
    <article id="project${project.id}">
      <h2>${project.name}</h2>
    </article>
  `)
}

const getPalettes = async () => {
  const initialFetch = await fetch('http://localhost:3000/api/v1/palettes');
  const palettes = await initialFetch.json();
  palettes.forEach(palette => {
    $(`#project${palette.project_id}`).append(`
      <section id="palette${palette.id}">
        <p>${palette.name}</p>
        <div>
          <div 
            id="palette${palette.id}-slide1" 
            class="saved-palette-slide">
          </div>
          <div 
            id="palette${palette.id}-slide2" 
            class="saved-palette-slide">
          </div>
          <div 
            id="palette${palette.id}-slide3" 
            class="saved-palette-slide">
          </div>
          <div 
            id="palette${palette.id}-slide4" 
            class="saved-palette-slide">
          </div>
          <div 
            id="palette${palette.id}-slide5" 
            class="saved-palette-slide">
          </div>
        </div>
          <img
            src='https://use.fontawesome.com/releases/v5.0.8/svgs/regular/trash-alt.svg'
            class='delete-palette trash'
            id="${palette.id}"
            alt='Delete Button'
          />
      </section>
    `)
    for (let i = 1; i <= 5; i++) {
    $(`#palette${palette.id}-slide${i}`).css('background-color', palette[`color${i}`]);
    }
  })
}

const loadPage = () => {
  setMainPalette()
  getProjects()
  getPalettes()
}

const addNewProject = async event => {
  event.preventDefault();
  const $projectName = $('#new-project').val();
  try {
    const initialFetch = await fetch('http://localhost:3000/api/v1/projects', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({name: $projectName})
    });
    const project = await initialFetch.json();
    renderProject(project) 
  } catch (error) {
    alert(error.message)
  }
}

const addNewPalette = event => {
  event.preventDefault()
  let newPalette = {}
  for ( let i = 1; i <= 5; i++ ) {
    newPalette[`color${i}`] = $(`.main-palette-hex${i}`).text()
  }
  newPalette.name = $('.palette-name-input').val()
  newPalette.project_id = $('#select-project').val()
  console.log(newPalette)
}

const saveNewPalette = async newPalette => {
  try {
    const initialFetch = await fetch('http://localhost:3000/api/v1/palettes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPalette)
    });
    const response = await initialFetch.json();
  } catch (error) {
    alert(error.message)
  }
}

const manipulatePalettes = (event) => {
  const { classList, id } = event.target;
  if (classList.contains('delete-palette')) {
    deletePalette(id)    
  }
}

const deletePalette = async id => {
  const initialFetch = await fetch(`http://localhost:3000/api/v1/palettes/${id}`, {
    method: 'DELETE'
  })
  $(`#palette${id}`).remove();
}

$(document).ready(loadPage);
$(document).keydown(getRandomPalette);
$('.new-main-palette-button').click(setMainPalette);
$('.new-project-form').submit(addNewProject);
$('.new-palette-form').submit(addNewPalette);
$('.project-wrapper').click(manipulatePalettes);
