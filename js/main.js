const api = `https://movie-api.cyclic.app`;
let page = 1,
  perPage = 10;
const noValue = 'N/A';

const createTableRows = (data) => {
  return new Promise((resolve, reject) => {
    let tableRows = `${data
      .map(
        (movie) =>
          `<tr data-id="${movie._id}">
              <td>${movie.year}</td>
              <td>${movie.title}</td>
              <td>${movie.plot ? movie.plot : noValue}</td>
              <td>${movie.rated ? movie.rated : noValue}</td>
              <td>${`${Math.floor(movie.runtime / 60)}.${(movie.runtime % 60).toString().padStart(2, '0')}`}</td>
          </tr>`
      )
      .join('')}`;

    tableRows != ''
      ? resolve(tableRows)
      : reject(`ERROR: Something went wrong when creating table rows. No rows created.`);
  });
};

const populateTableRows = (tableRows) => {
  // populating the table with the string of table rows held by the parameter
  document.querySelector('#moviesTable tbody.tableBody').innerHTML = tableRows;

  // targetting each row in the table
  document.querySelectorAll('#moviesTable tbody.tableBody tr').forEach((row) => {
    // adding a 'click' event to each row in the table
    row.addEventListener('click', (event) => {
      // fetching the movie object for the movie/row where the 'click' event was triggered
      fetch(api + `/api/movies/${row.getAttribute('data-id')}`)
        .then((res) => res.json())
        .then((data) => {
          document.querySelector('#detailsModal h5.modal-title').innerHTML = data.title;
          document.querySelector('#detailsModal div.modal-body').innerHTML = `
          <img class="img-fluid w-100" src="${data.poster}"><br><br>
          <strong>Directed By:</strong> ${data.directors.join(', ')}<br><br>
          <p>${data.fullplot}</p>
          <strong>Cast:</strong> ${data.cast.length > 0 ? data.cast.join(', ') : noValue}<br><br>
          <strong>Awards:</strong> ${data.awards.text}<br>
          <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)
          `;
        });

      let modal = new bootstrap.Modal(document.getElementById('detailsModal'), {
        backdrop: 'static', // default true - "static" indicates that clicking on the backdrop will not close the modal window
        keyboard: false, // default true - false indicates that pressing on the "esc" key will not close the modal window
        focus: true, // default true - this instructs the browser to place the modal window in focus when initialized
      });

      modal.show();
    });
  });
};

const updatePagination = (titleSpecified) => {
  // toggling pagination
  const pagination = document.querySelector('ul.pagination');
  const toggleClassList = ['d-none'];
  titleSpecified ? pagination.classList.add(...toggleClassList) : pagination.classList.remove(toggleClassList);

  //
  document.querySelector('#paginationCurrent').innerHTML = page;
};

const loadMovieData = (title = null) => {
  // fetching data from the api, using an api request url
  fetch(api + `/api/movies?page=${page}&perPage=${perPage}${title ? `&title=${title}` : ''}`)
    .then((res) => res.json())
    .then((data) => {
      createTableRows(data)
        .then((tableRows) => {
          populateTableRows(tableRows);
          updatePagination(title ? true : false);
        })
        .catch((err) => {
          console.warn(err);
        });
    });
};

document.addEventListener('DOMContentLoaded', (event) => {
  loadMovieData();
});
