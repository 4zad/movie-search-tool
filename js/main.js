let page = 1,
  perPage = 10;

const createTableRows = (data) => {
  return new Promise((resolve, reject) => {
    let tableRows = `${data
      .map(
        (movie) =>
          `<tr data-id="${movie._id}">
              <td>${movie.year}</td>
              <td>${movie.title}</td>
              <td>${movie.plot ? movie.plot : `N/A`}</td>
              <td>${movie.rated ? movie.rated : `N/A`}</td>
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
  document.querySelector('#moviesTable tbody.tableBody').innerHTML = tableRows;
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
  // creating api request url
  const api = `https://movie-api.cyclic.app`;
  let requestUrl = api + `/api/movies?page=${page}&perPage=${perPage}${title ? `&title=${title}` : ''}`;

  // fetching data from the api, using the api request url
  fetch(requestUrl)
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
