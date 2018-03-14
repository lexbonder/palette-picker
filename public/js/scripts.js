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
    $(`.main-palette-slide${i}`).css('background-color', mainPalette[`color${i}`]);
    $(`.main-palette-hex${i}`).text(mainPalette[`color${i}`]);
  }
  saveMainPalette(mainPalette)
}

const saveMainPalette = async mainPalette => {
  const initialFetch = await fetch('http://localhost:3000/api/v1/main-palette', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({mainPalette})
  })
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
    $(`#project${palette.projectId}`).append(`
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
        <button class='delete-palette'>
          <i class="far fa-trash-alt"></i>
        </button>
      </section>
    `)
    for (let i = 1; i <= 5; i++) {
    $(`#palette${palette.id}-slide${i}`).css('background-color', palette.palette[`color${i}`]);
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
    if($projectName) {
      const initialFetch = await fetch('http://localhost:3000/api/v1/projects', {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({name: $projectName})
      });
      const project = await initialFetch.json();
      renderProject(project)
    } else {
      throw Error('Project name not provided')
    }
  } catch (error) {
    alert(error.message)
  }
}

$(document).ready(loadPage);
$(document).keydown(getRandomPalette);
$('.new-main-palette-button').click(setMainPalette);
$('.new-project-form').submit(addNewProject);
