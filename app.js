const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');


const app = express ();
const PORT = process.env.PORT || 3001;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// Route to serve the homepage

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// API route to get all notes
app.get('/api/notes', (req, res) =>{
    fs.readFile('db/db.json', 'utf8', (err,data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        res.status(200).json(notes);
       });
    });

// API route to save a new note
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      const newNote = req.body;
      newNote.id = uuid.v4();
      notes.push(newNote);
  
      fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.json(newNote);
      });
    });
  });    

    // API route to delete a note
    app.delete('/api/notes/:id', (req, res) => {
        const noteId = req.params.id;
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) throw err;
            const notes = JSON.parse(data);
            const filteredNotes = notes.filter((note) => note.id !== noteId);

            fs.writeFile('./db/db.json', JSON. stringify(filteredNotes), (err) => {
                if (err) throw err;
                res.json({ msg: 'Note deleted' });
            });
        });
    });

    // Start te server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });