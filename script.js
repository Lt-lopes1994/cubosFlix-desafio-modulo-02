const filmCatalog = document.querySelector('.movies');
const highligthImg = document.querySelector('.highlight__video')
const highligthTitle = document.querySelector('.highlight__title')
const highlightRating = document.querySelector('.highlight__rating')
const highligthGenre = document.querySelector('.highlight__genres')
const highlightLaunch = document.querySelector('.highlight__launch')
const highlightDescription = document.querySelector('.highlight__description')
const highlightVideo = document.querySelector('.highlight__video-link')
const searchInput = document.querySelector('.input')
const btnTheme = document.querySelector('.btn-theme')
const next = document.querySelector('.btn-next')
const prev = document.querySelector('.btn-prev')
const body = document.querySelector('body')
let arrayGenre = []
let perPage = 5

let currentTheme = 'light';

btnTheme.addEventListener('click', () => {
  
  if (currentTheme === 'light'){
    currentTheme = 'dark';
    btnTheme.src = './assets/dark-mode.svg'
    body.style.setProperty('--background-color', '#242424')
    body.style.setProperty('--input-border-color', '#fff')
    body.style.setProperty('--color', '#fff')
    body.style.setProperty('--highlight-background', '#000')
    body.style.setProperty('--highlight-color', 'rgba(100, 100, 100, 0.7)')
    body.style.setProperty('--highlight-description', 'rgba(0, 0, 0, 0.7)')
    body.style.setProperty('--highlight-description', '#fff')
  }else{
    currentTheme = 'light';
    btnTheme.src = './assets/light-mode.svg';
    body.style.setProperty('--background-color', '#fff')
    body.style.setProperty('--input-border-color', '#979797')
    body.style.setProperty('--color', '#000')
    body.style.setProperty('--highlight-background', '#fff')
    body.style.setProperty('--highlight-color', 'rgba(0, 0, 0, 0.7)')
    body.style.setProperty('--highlight-description', '#000')
    
  }
})

function gradueiRuli() {
  fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR').then((resposta) => {
    const promisseBody = resposta.json();
    promisseBody.then((movies) => {


      const state = {
        page: 1,
        perPage,
        totalPage: Math.ceil(movies.results.length / perPage)
      }

      const controls = {
        next() {
          state.page++;

          if (state.page > state.totalPage) {
            state.page = 1
          };
          update()
        },
        prev() {
          state.page--;

          if (state.page < 1) {
            state.page = state.totalPage
          };
          update()
        },
        createListeners() {
          prev.addEventListener('click', () => {
            controls.prev();
          })
          next.addEventListener('click', () => {
            controls.next();
          })
        }
      }

      const list = {
        create(movie) {
          const movieImg = document.createElement('div')
          movieImg.style.backgroundImage = `url(${movie.poster_path})`
          movieImg.classList.add('movie')

          const movieInfo = document.createElement('div')
          movieInfo.classList.add('movie__info')

          const title = document.createElement('span');
          title.textContent = movie.title;
          title.classList.add("movie__title");

          const rating = document.createElement('span');
          rating.textContent = movie.vote_average;
          rating.classList.add('movie__rating')

          const starRating = document.createElement('img')
          starRating.src = "./assets/estrela.svg"

          movieInfo.append(title, rating, starRating)
          movieImg.append(movieInfo)
          filmCatalog.append(movieImg)

          movieImg.addEventListener('click', () => {
            fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movie.id}?language=pt-BR`).then(resposta => {

              const modal = document.querySelector('.modal');
              modal.classList.remove('hidden');
              modal.addEventListener('click', () => {
                modal.classList.add('hidden')
              });

              const titleModal = document.querySelector('.modal__title');
              titleModal.textContent = movie.title

              const modalImg = document.querySelector('.modal__img');
              modalImg.src = movie.backdrop_path

              const modalDescription = document.querySelector('.modal__description');
              modalDescription.textContent = movie.overview

              const modalRating = document.querySelector('.modal__average');
              modalRating.textContent = movie.vote_average
            })
          })
        },
        update() {
          filmCatalog.innerHTML = ''
          let page = state.page - 1
          let start = page * state.perPage
          let end = start + state.perPage

          const paginatedItems = movies.results.slice(start, end);

          paginatedItems.forEach(list.create)
        }
      }

      function update() {
        list.update()
      }

      function init() {
        list.update()
        controls.createListeners()
      }


      init()
    })
  });
}

gradueiRuli()

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then((resposta) => {
  const promisseBody = resposta.json();
  promisseBody.then((movie) => {
    highligthImg.style.backgroundImage = `url(${movie.backdrop_path})`;

    const title = document.createElement('h3')
    title.textContent = movie.title

    const rating = document.createElement('span');
    rating.textContent = movie.vote_average

    let genre = document.createElement('span');
    movie.genres.forEach(genre => {
      arrayGenre.push(genre.name)
    })
    genre = arrayGenre.join(',')

    const releaseDate = document.createElement('span');
    releaseDate.textContent = movie.release_date

    const overview = document.createElement('p');
    overview.textContent = movie.overview


    highlightVideo.href = `https://www.youtube.com/watch?v=${movie.key}`



    highligthTitle.append(title)
    highlightRating.append(rating)
    highligthGenre.append(genre)
    highlightLaunch.append(releaseDate)
    highlightDescription.append(overview)

    
  })
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;

  if (searchInput.value === '') {
    return gradueiRuli()
  } else {
    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${searchInput.value}`).then((resposta) => {
      const promisseBody = resposta.json();
      promisseBody.then((movies) => {
        const state = {
          page: 1,
          perPage,
          totalPage: Math.ceil(movies.results.length / perPage)
        }

        const controls = {
          next() {
            state.page++;

            if (state.page > state.totalPage) {
              state.page = 1
            };
            update()
          },
          prev() {
            state.page--;

            if (state.page < 1) {
              state.page = state.totalPage
            };
            update()
          },
          createListeners() {
            prev.addEventListener('click', () => {
              controls.prev();
            })
            next.addEventListener('click', () => {
              controls.next();
            })
          }
        }

        const list = {
          create(movie) {
            const movieImg = document.createElement('div')
            movieImg.style.backgroundImage = `url(${movie.poster_path})`
            movieImg.classList.add('movie')

            const movieInfo = document.createElement('div')
            movieInfo.classList.add('movie__info')

            const title = document.createElement('span');
            title.textContent = movie.title;
            title.classList.add("movie__title");

            const rating = document.createElement('span');
            rating.textContent = movie.vote_average;
            rating.classList.add('movie__rating')

            const starRating = document.createElement('img')
            starRating.src = "./assets/estrela.svg"

            movieInfo.append(title, rating, starRating)
            movieImg.append(movieInfo)
            filmCatalog.append(movieImg)

            movieImg.addEventListener('click', () => {
              fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movie.id}?language=pt-BR`).then(resposta => {

                const modal = document.querySelector('.modal');
                modal.classList.remove('hidden');
                modal.addEventListener('click', () => {
                  modal.classList.add('hidden')
                });
  
                const titleModal = document.querySelector('.modal__title');
                titleModal.textContent = movie.title
  
                const modalImg = document.querySelector('.modal__img');
                modalImg.src = movie.backdrop_path
  
                const modalDescription = document.querySelector('.modal__description');
                modalDescription.textContent = movie.overview
  
                const modalRating = document.querySelector('.modal__average');
                modalRating.textContent = movie.vote_average
              })
            })
          },
           
          


          update() {
            filmCatalog.innerHTML = ''
            let page = state.page - 1
            let start = page * state.perPage
            let end = start + state.perPage

            const paginatedItems = movies.results.slice(start, end);

            paginatedItems.forEach(list.create)
          }
        }

        function update() {
          list.update()
        }

        function init() {
          list.update()
          controls.createListeners()
        }

        init()
      })
    })
  }
})