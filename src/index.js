document.addEventListener('DOMContentLoaded', () => {
  getAllMovies()
})

let getAllMovies = () => {
  fetch('http://localhost:3000/movies') 
  .then(res => res.json()) 
  .then(data => data.forEach(getEveryMovie))
}

const makeEl = el => document.createElement(el)

function getEveryMovie(m) {
  const img = makeEl('img')
  img.src = m.img_link
  img.className = 'image'
  document.querySelector('div#movie-list').appendChild(img)
}

