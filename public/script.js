let currentPage = 1;
let currentData = [];
let isFetching = false;

const backendUrl = "https://intern-task-5.vercel.app/api/books"; // Replace with your live URL

document.getElementById('language').addEventListener('change', resetAndFetch);
document.getElementById('seed').addEventListener('input', resetAndFetch);
document.getElementById('likes').addEventListener('input', resetAndFetch);
document.getElementById('reviews').addEventListener('input', resetAndFetch);
document.getElementById('randomSeed').addEventListener('click', generateRandomSeed);

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        fetchData();
    }
});

fetchData();

function resetAndFetch() {
    currentPage = 1;
    currentData = [];
    fetchData();
}

function generateRandomSeed() {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    document.getElementById('seed').value = randomSeed;
    resetAndFetch();
}

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
            renderTable(currentData);
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
}