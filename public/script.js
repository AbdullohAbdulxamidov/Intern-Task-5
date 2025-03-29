const backendUrl = "https://intern-task-5.vercel.app/api/books"; // Replace with your live URL

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