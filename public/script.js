let currentPage = 1;
let currentData = [];
let isFetching = false;
let isTableView = true; // Tracks whether the table or gallery view is active

const backendUrl = "https://intern-task-5.vercel.app/api/books"; // Replace with your live URL

// Event Listeners
document.getElementById('language').addEventListener('change', resetAndFetch);
document.getElementById('seed').addEventListener('input', resetAndFetch);
document.getElementById('likes').addEventListener('input', resetAndFetch);
document.getElementById('reviews').addEventListener('input', resetAndFetch);
document.getElementById('randomSeed').addEventListener('click', generateRandomSeed);
document.getElementById('toggleView').addEventListener('click', toggleView);
document.getElementById('exportCSV').addEventListener('click', exportToCSV);

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        fetchData();
    }
});

fetchData();

// Reset Data and Re-fetch
function resetAndFetch() {
    currentPage = 1;
    currentData = [];
    fetchData();
}

// Generate Random Seed
function generateRandomSeed() {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    document.getElementById('seed').value = randomSeed;
    resetAndFetch();
}

// Fetch Data from Backend
async function fetchData() {
    if (isFetching) return;
    isFetching = true;

    const region = document.getElementById('language').value;
    const seed = document.getElementById('seed').value || 'default';
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
            if (currentPage === 1) {
                currentData = data;
            } else {
                currentData = [...currentData, ...data];
            }
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

// Render Content (Table or Gallery)
function renderContent(data) {
    if (isTableView) {
        renderTable(data);
    } else {
        renderGallery(data);
    }
}

// Render Table
function renderTable(data) {
    const tbody = document.querySelector('#bookTable tbody');
    tbody.innerHTML = '';

    data.forEach((book, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${index + 1}</td>
      <td>${book.isbn}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.publisher}</td>
      <td>${book.likes}</td>
      <td>${book.reviews}</td>
    `;
        tbody.appendChild(row);
    });

    document.getElementById('bookTable').classList.remove('hidden');
    document.getElementById('galleryView').classList.add('hidden');
}

// Render Gallery
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

    document.getElementById('bookTable').classList.add('hidden');
    document.getElementById('galleryView').classList.remove('hidden');
}

// Toggle View (Table/Gallery)
function toggleView() {
    isTableView = !isTableView;
    renderContent(currentData);
}

// Export to CSV
function exportToCSV() {
    const csvRows = [
        ['Index', 'ISBN', 'Title', 'Author', 'Publisher', 'Likes', 'Reviews'],
        ...currentData.map((book, index) => [
            index + 1,
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