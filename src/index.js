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
const movieList = document.querySelector('#movie-list')
const movieDetail = document.querySelector('div#movie-detail').children
const commentsAndRating = document.querySelector('div.commentsAndRating')
const rating = commentsAndRating.querySelector('#movie-rating')
const comment = commentsAndRating.querySelector('.movie-comment')

const defaultInfo = {
  "name": "Movie title goes here...",
  "img_link": "./src/image-placeholder.jpg",
  "genre": "Movie genre goes here...",
  "year": "Year: ...",
  "rating": 0.0,
  "comment": "Comments about the movie..."
}

function getEveryMovie(m) {

  const img = makeEl('img')
  img.src = m.img_link
  img.className = 'poster'

  movieList.appendChild(img)

  img.addEventListener('click', () => {
    console.log('Mmmm:', m);
    setMovieInfoToDom(m)
    deleteMovie(img)
  })
}

function deleteMovie(img) {
  const deleteBtn = document.querySelector('button#deleteBtn')
  deleteBtn.addEventListener('click', () => {

    const currentMovie = document.querySelector('h3.title').innerText
    if (list.length === 1) {
      setMovieInfoToDom(defaultInfo)
    }

    for (let i = 0; i < list.length; i++) {
      // debugger
      if (list[i].name === currentMovie && list.length > 1) {
        console.log('List[i]:', list[i+1]);
        setMovieInfoToDom(list[i + 1])
        removeMovieFromDB(list[i])
        img.remove()
      } else {
        setMovieInfoToDom(defaultInfo)        
        img.remove()
      }
    }
    
  })
}

function saveMovie() {
  const saveBtn = document.querySelector('button#saveBtn')
  saveBtn.addEventListener('click', () => {
    const currentMovie = movieDetail[1].innerText
    let found = list.find(obj => obj.name === currentMovie ? true : false)
    if (!found) {

      const img = makeEl('img')
      img.src = movieDetail[0].src
      img.className = 'poster'
      document.querySelector('#movie-list').appendChild(img)

      const obj = {
        "name": currentMovie,
        "img_link": movieDetail[0].src,
        "genre": movieDetail[2].innerText,
        "year": movieDetail[3].innerText,
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
      .then(movie => {
        console.log('AAAA:', movie);
        movieDetail[0].src = movie.Poster
        movieDetail[1].innerText = movie.Title
        movieDetail[2].innerText = movie.Genre
        movieDetail[3].innerText = `Year: ${movie.Year}`
        const rate = movie.Ratings[0].Value.split('/')
        rating.textContent = rate[0]
        comment.textContent = movie.Plot
      })
  })
}

function setMovieInfoToDom(data) {
  movieDetail[0].src = data.img_link
  movieDetail[1].innerText = data.name
  movieDetail[2].innerText = data.genre
  movieDetail[3].innerText = `Year: ${data.year}`
  rating.textContent = data.rating
  comment.textContent = data.comment
}