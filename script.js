const postsContainer = document.getElementById('posts');
const loading = document.getElementById('loading');
let isLoading = false; // Prevent overlapping requests
let page = 1; // Current page to fetch

// Fetch posts from JSONPlaceholder API
async function fetchPosts(page) {
  const url = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=5`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
}

// Load posts and append them to the DOM
async function loadMorePosts() {
  if (isLoading) return; // Prevent overlapping requests
  isLoading = true;
  loading.style.display = 'block';

  try {
    const newPosts = await fetchPosts(page);
    newPosts.forEach((post) => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.body}</p>
      `;
      postsContainer.appendChild(postElement);
    });

    // Increment the page number for the next call
    if (newPosts.length > 0) {
      page++;
    } else {
      // Hide loading if no more posts
      document.removeEventListener('scroll', handleScroll);
      loading.textContent = 'No more posts to load';
    }
  } catch (error) {
    console.error('Error loading posts:', error);
    loading.textContent = 'Failed to load posts';
  } finally {
    loading.style.display = 'none';
    isLoading = false;
  }
}

// Detect when the user has scrolled near the bottom
function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
    loadMorePosts();
  }
}

// Initialize infinite scroll
document.addEventListener('scroll', handleScroll);

// Load initial posts
loadMorePosts();
