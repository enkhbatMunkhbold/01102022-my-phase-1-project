document.addEventListener('DOMContentLoaded', () => {
  renderFavoriteMovieList()
  saveMovie()
  searchMovies()
})

let renderFavoriteMovieList = () => {
  fetch('http://localhost:3000/movies')
    .then(res => res.json())
    .then(data => list = data)
    .then(data => data.forEach(getEveryMovie))
}

const makeEl = el => document.createElement(el)
const movieDetail = document.querySelector('div#movie-detail').children
const commentsAndRating = document.querySelector('div.commentsAndRating')
const rating = commentsAndRating.querySelector('#movie-rating')
const comment = commentsAndRating.querySelector('.movie-comment')
let foundMovie = {}

function getEveryMovie(m) {

  const img = makeEl('img')
  img.src = m.img_link
  img.className = 'poster'

  document.querySelector('div#movie-list').appendChild(img)

  img.addEventListener('click', (e) => {
    movieDetail[0].src = e.target.src
    movieDetail[1].innerText = m.name
    movieDetail[2].innerText = m.genre
    movieDetail[3].innerText = `Year: ${m.year}`
    rating.textContent = m.rating
    comment.textContent = m.comment
    deleteMovie(img)
  })
}

function deleteMovie(img) {
  const deleteBtn = document.querySelector('button#deleteBtn')
  deleteBtn.addEventListener('click', () => {
    img.remove()
    const currentMovie = document.querySelector('h3.title').innerText
    for (let i = 0; i < list.length - 1; i++) {
      if (list[i].name === currentMovie) {
        // selectedMovieInList.remove()
        movieDetail[0].src = list[i + 1].img_link
        movieDetail[1].innerText = list[i + 1].name
        movieDetail[2].innerText = list[i + 1].genre
        movieDetail[3].innerText = `Year: ${list[i+1].year}`
        rating.textContent = list[i + 1].rating
        comment.textContent = list[i + 1].comment

        removeMovieFromDB(list[i])
      }
    }
  })
}

function saveMovie() {
  const saveBtn = document.querySelector('button#saveBtn')
  saveBtn.addEventListener('click', () => {
    console.log('list:', list);
    const currentMovie = movieDetail[1].innerText
    let found = list.find(obj => obj.name === currentMovie ? true : false)
    if (!found) {

      const img = makeEl('img')
      img.src = movieDetail[0].src
      img.className = 'poster'
      document.querySelector('div#movie-list').appendChild(img)

      const obj = {
        "name": currentMovie,
        "img_link": movieDetail[0].src,
        "genre": movieDetail[2].innerText,
        "year": Number(movieDetail[3].innerText),
        "rating": Number(rating.textContent),
        "comment": comment.innerText
      }

      fetch('http://localhost:3000/movies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(obj)
        })
        .then(res => res.json())
        .then(data => console.log(data))
    }
  })
}

function removeMovieFromDB(movie) {
  fetch(`http://localhost:3000/movies/${movie.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(movie => console.log(movie))
}

function searchMovies() {
  const search = document.querySelector('#search-form')
  search.addEventListener('submit', (e) => {
    e.preventDefault()
    const movieName = e.target[0].value


    fetch(`http://www.omdbapi.com/?t=${movieName}&apikey=19546fcd`)
    .then(res => res.json())
    .then(data => {
      console.log('Data:', data);
      movieDetail[0].src = data.Poster
      movieDetail[1].innerText = data.Title
      movieDetail[2].innerText = data.Genre
      movieDetail[3].innerText = `Year: ${data.Year}`
      const rate = data.Ratings[0].Value.split('/')
      rating.textContent = rate[0]
      comment.textContent = data.Plot
    })    
  })

 
  
}

function getMovieFromBackend(name) {
  
}