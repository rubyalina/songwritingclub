document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedbackForm');
    const analysisForm = document.getElementById('analysisForm');
    const feedbackPosts = document.getElementById('feedbackPosts');
    const analysisPosts = document.getElementById('analysisPosts');

    // Function to create a timestamp
    function getTimestamp() {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
        };
        return new Intl.DateTimeFormat('en-US', options).format(new Date());
    }

    // Function to add a post
    function addPost(type, title, source, description) {
        const posts = JSON.parse(localStorage.getItem(type)) || [];
        const timestamp = getTimestamp();
        posts.push({ title, source, description, timestamp });
        localStorage.setItem(type, JSON.stringify(posts));
        loadPosts(); // Reload posts to reflect the changes
    }

    // Function to delete a post
    window.deletePost = function(type, index) {
        const posts = JSON.parse(localStorage.getItem(type)) || [];
        posts.splice(index, 1);
        localStorage.setItem(type, JSON.stringify(posts));
        loadPosts(); // Reload posts to reflect the changes
    }

    // Function to display posts
    function displayPosts(type, posts) {
        const container = document.getElementById(`${type}Posts`);
        container.innerHTML = ''; // Clear existing posts
        posts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            let mediaContent = '';

            if (post.source.startsWith('http')) {
                // Treat as YouTube link
                mediaContent = `<iframe width="560" height="315" src="${post.source}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            } else {
                // Treat as MP3
                mediaContent = `<audio controls>
                                    <source src="${post.source}" type="audio/mp3">
                                    Your browser does not support the audio element.
                                 </audio>`;
            }

            postElement.innerHTML = `
                <h3>${post.title}</h3>
                ${mediaContent}
                <p>${post.description}</p>
                <p class="timestamp">${post.timestamp}</p>
                <button class="delete" onclick="deletePost('${type}', ${index})">Delete</button>
            `;
            container.appendChild(postElement);
        });
    }

    // Function to load posts from local storage
    function loadPosts() {
        const feedbackPostsData = JSON.parse(localStorage.getItem('feedback')) || [];
        const analysisPostsData = JSON.parse(localStorage.getItem('analysis')) || [];
        displayPosts('feedback', feedbackPostsData);
        displayPosts('analysis', analysisPostsData);
    }

    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('feedbackTitle').value;
        const audioFile = document.getElementById('feedbackAudio').files[0];
        const description = document.getElementById('feedbackDescription').value;

        if (audioFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                addPost('feedback', title, event.target.result, description);
                feedbackForm.reset();
            };
            reader.readAsDataURL(audioFile);
        }
    });

    analysisForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('analysisTitle').value;
        const source = document.getElementById('analysisSource').value;
        const audioFile = document.getElementById('analysisAudio').files[0];
        const description = document.getElementById('analysisDescription').value;

        if (source && !audioFile) {
            addPost('analysis', title, source, description);
            analysisForm.reset();
        } else if (audioFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                addPost('analysis', title, event.target.result, description);
                analysisForm.reset();
            };
            reader.readAsDataURL(audioFile);
        } else {
            alert("Please provide either a YouTube link or upload an MP3 file.");
        }
    });

    loadPosts(); // Initial load of posts
});
