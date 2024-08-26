// Sample posts (initially empty)
const posts = [];

// Function to display posts
function displayPosts() {
    const postsContainer = document.getElementById('feedback');
    postsContainer.innerHTML = ''; // Clear previous posts
    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p><em>${post.date}</em></p>
            <p>${post.content}</p>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Handle form submission
document.getElementById('submission-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const content = document.getElementById('content').value;
    
    posts.push({ title, date, content });
    
    document.getElementById('submission-form').reset();
    displayPosts();
});

// Load posts when the page is ready
document.addEventListener('DOMContentLoaded', displayPosts);
