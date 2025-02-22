document.addEventListener('DOMContentLoaded', () => {
  // Fetch blog posts from the backend
  fetch('http://localhost:3000/api/posts')
    .then((response) => response.json()) // Convert response to JSON
    .then((posts) => {
      const blogPosts = document.getElementById('blog-posts'); // Get the container for posts
      posts.forEach((post) => {
        // Create HTML for each post
        const postElement = document.createElement('article');
        postElement.classList.add('post');
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <p><strong>By ${post.author}</strong> on ${new Date(post.date).toLocaleDateString()}</p>
        `;
        blogPosts.appendChild(postElement); // Add the post to the page
      });
    })
    .catch((error) => console.error('Error fetching posts:', error)); // Handle errors
});

// Handle form submission to add a new post
document.getElementById('add-post-form').addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the form from refreshing the page
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const author = document.getElementById('author').value;

  // Send a POST request to the backend
  fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, author }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert('Post added successfully!');
      window.location.reload(); // Refresh the page to show the new post
    })
    .catch((error) => console.error('Error adding post:', error));
});
// Function to fetch and display comments for a post
function fetchComments(postId) {
  fetch(`http://localhost:3000/api/comments/${postId}`)
    .then((response) => response.json())
    .then((comments) => {
      const commentsList = document.getElementById(`comments-${postId}`);
      commentsList.innerHTML = ''; // Clear existing comments
      comments.forEach((comment) => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
          <p class="author">${comment.author}</p>
          <p>${comment.content}</p>
          <p class="date">${new Date(comment.date).toLocaleDateString()}</p>
        `;
        commentsList.appendChild(commentElement);
      });
    })
    .catch((error) => console.error('Error fetching comments:', error));
}

// Function to handle comment submission
function handleCommentSubmit(event) {
  event.preventDefault();
  const postId = event.target.dataset.postId;
  const author = event.target.querySelector('.comment-author').value;
  const content = event.target.querySelector('.comment-content').value;

  fetch('http://localhost:3000/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: postId, author, content }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert('Comment added successfully!');
      fetchComments(postId); // Refresh comments
      event.target.reset(); // Clear the form
    })
    .catch((error) => console.error('Error adding comment:', error));
}

// Add event listeners to comment forms
document.addEventListener('DOMContentLoaded', () => {
  const commentForms = document.querySelectorAll('.add-comment-form');
  commentForms.forEach((form) => {
    form.addEventListener('submit', handleCommentSubmit);
  });

  // Fetch comments for each post
  const posts = document.querySelectorAll('.post');
  posts.forEach((post) => {
    const postId = post.dataset.postId;
    fetchComments(postId);
  });
});