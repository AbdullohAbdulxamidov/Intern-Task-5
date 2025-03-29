let currentPage = 1;
let currentData = [];
let isFetching = false;

// Backend URL (relative path since backend is hosted on the same Vercel app)
const backendUrl = "/api/books";

document.getElementById('likes').addEventListener('input', (e) => {
    document.getElementById('likesValue').textContent = e.target.value;
    resetAndFetchData();
});

document.getElementById('region').addEventListener('change', resetAndFetchData);
document.getElementById('seed').addEventListener('input', resetAndFetchData);
document.getElementById('reviews').addEventListener('input', resetAndFetchData);

document.getElementById('randomSeed').addEventListener('click', () => {
    const randomSeed = Math.floor(Math.random() * 1000000);
    document.getElementById('seed').value = randomSeed;
    resetAndFetchData();
});

document.getElementById('exportCSV').addEventListener('click', exportCSV);
document.getElementById('toggleView').addEventListener('click', toggleView);

async function fetchData() {
    if (isFetching) return;
    isFetching = true;

    const region = document.getElementById('region').value;
    const seed = document.getElementById('seed').value || 'random';
    const likes = document.getElementById('likes').value;
    const reviews = document.getElementById('reviews').value;

    try {
        const url = `${backendUrl}?page=${currentPage}&region=${region}&seed=${seed}&likes=${likes}&reviews=${reviews}`;
        console.log('Fetching URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        console.log('Fetched Data:', data);

        currentData = [...currentData, ...data];
        renderTable(currentData);
        currentPage++;
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        isFetching = false;
    }
}

function renderTable(data) {
    const table = document.getElementById('bookTable');
    table.innerHTML = `
    <table>
      <tr>
        <th>Index</th>
        <th>ISBN</th>
        <th>Title</th>
        <th>Author</th>
        <th>Publisher</th>
      </tr>
      ${data.map((book, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${book.isbn}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.publisher}</td>
        </tr>
      `).join('')}
    </table>
  `;
}

function toggleView() {
    const table = document.getElementById('bookTable');
    table.classList.toggle('gallery-view');

    if (table.classList.contains('gallery-view')) {
        renderGallery(currentData);
    } else {
        renderTable(currentData);
    }
}

function renderGallery(data) {
    const table = document.getElementById('bookTable');
    table.innerHTML = data.map(book => `
    <div class="book-card">
      <img src="${book.details.coverImage}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Publisher:</strong> ${book.publisher}</p>
    </div>
  `).join('');
}

function exportCSV() {
    const csvContent = "data:text/csv;charset=utf-8,"
        + currentData.map(book => `${book.isbn},${book.title},${book.author},${book.publisher}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "books.csv");
    document.body.appendChild(link);
    link.click();
}

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isFetching) {
        fetchData();
    }
});

function resetAndFetchData() {
    currentPage = 1;
    currentData = [];
    fetchData();
}

fetchData();