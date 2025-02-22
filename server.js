const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Connect to the SQLite database
const db = new sqlite3.Database('../blog.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Middleware to parse JSON requests
app.use(express.json());

// Route to fetch all blog posts
app.get('/api/posts', (req, res) => {
  db.all('SELECT * FROM posts', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Route to add a new blog post
app.post('/api/posts', (req, res) => {
  const { title, content, author } = req.body;
  const date = new Date().toISOString();

  db.run(
    'INSERT INTO posts (title, content, author, date) VALUES (?, ?, ?, ?)',
    [title, content, author, date],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});
// Route to add a comment
app.post('/api/comments', (req, res) => {
  const { post_id, author, content } = req.body;
  const date = new Date().toISOString();

  db.run(
    'INSERT INTO comments (post_id, author, content, date) VALUES (?, ?, ?, ?)',
    [post_id, author, content, date],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Route to fetch comments for a post
app.get('/api/comments/:post_id', (req, res) => {
  const { post_id } = req.params;
  db.all('SELECT * FROM comments WHERE post_id = ?', [post_id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});