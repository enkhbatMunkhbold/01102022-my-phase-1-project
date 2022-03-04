document.addEventListener('DOMContentLoaded', () => {
  renderFavoriteMovieList()
})

let renderFavoriteMovieList = () => {
  fetch('http://localhost:3000/movies') 
  .then(res => res.json()) 
  .then(data => data.forEach(getEveryMovie))
}

const makeEl = el => document.createElement(el)

function getEveryMovie(m) {
  const img = makeEl('img')
  img.src = m.img_link
  img.className = 'poster'
  document.querySelector('div#movie-list').appendChild(img)

  const movie = document.querySelector('div#movie-detail').children
  const commentsAndRating = document.querySelector('div.commentsAndRating')

  img.addEventListener('click', (e) => { 
    movie[0].src = e.target.src
    movie[1].innerText = m.genre
    movie[2].innerText = m.year
    commentsAndRating.querySelector('#movie-rating').textContent = m.rating
    commentsAndRating.querySelector('.movie-comment').textContent = m.comment
  })
}
