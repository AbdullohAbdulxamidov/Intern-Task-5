let currentPage = 1;
let currentData = [];
let isFetching = false;
let isTableView = true;

const backendUrl = "https://intern-task-5.vercel.app/api/books"; // Replace with your live URL

document.getElementById('toggleView').addEventListener('click', toggleView);
document.getElementById('exportCSV').addEventListener('click', exportToCSV);

async function fetchData() {
    if (isFetching) return;
    isFetching = true;

    const region = document.getElementById('region').value;
    const seed = document.getElementById('seed').value || 'random';
    const likes = document.getElementById('likes').value;
    const reviews = document.getElementById('reviews').value;

    try {
        const url = `${backendUrl}?page=${currentPage}&region=${region}&seed=${seed}&likes=${likes}&reviews=${reviews}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data)) {
            currentData = [...currentData, ...data];
            renderContent(currentData);
            currentPage++;
        } else {
            console.error('Invalid data format:', data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        isFetching = false;
    }
}

function renderContent(data) {
    if (isTableView) {
        renderTable(data);
    } else {
        renderGallery(data);
    }
}

function renderTable(data) {
    const table = document.getElementById('bookTable');
    table.innerHTML = `
    <tr>
      <th>ISBN</th>
      <th>Title</th>
      <th>Author</th>
      <th>Publisher</th>
      <th>Likes</th>
      <th>Reviews</th>
    </tr>
  `;
    data.forEach((book) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${book.isbn}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.publisher}</td>
      <td>${book.likes}</td>
      <td>${book.reviews}</td>
    `;
        table.appendChild(row);
    });
}

function renderGallery(data) {
    const gallery = document.getElementById('galleryView');
    gallery.innerHTML = '';
    data.forEach((book) => {
        const card = document.createElement('div');
        card.classList.add('gallery-card');
        card.innerHTML = `
      <img src="${book.details.coverImage}" alt="${book.title}" />
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Publisher:</strong> ${book.publisher}</p>
      <p><strong>Likes:</strong> ${book.likes}</p>
      <p><strong>Reviews:</strong> ${book.reviews}</p>
    `;
        gallery.appendChild(card);
    });
}

function toggleView() {
    isTableView = !isTableView;
    renderContent(currentData);
}

function exportToCSV() {
    const csvRows = [
        ['ISBN', 'Title', 'Author', 'Publisher', 'Likes', 'Reviews'],
        ...currentData.map((book) => [
            book.isbn,
            book.title,
            book.author,
            book.publisher,
            book.likes,
            book.reviews,
        ]),
    ];

    const csvString = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'books.csv';
    a.click();
    URL.revokeObjectURL(url);
}

// Infinite Scroll
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        fetchData();
    }
});

// Initial Data Fetch
fetchData();