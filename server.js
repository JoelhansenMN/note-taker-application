const express = require('express');
const fs = require('fs');
const path = require('path')
const {v4: uuidv4} = require('uuid');
const PORT = process.env.PORT || 3001;
const app = express();

//sets up express app to handle data parser/middleware created
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//express to create a route for every file in the public folder
app.use(express.static('public'));


//get route that should read the db.json file and return the notes as JSON
app.get('/api/notes', (req,res) =>{
  
  let allNotes = fs.readFileSync(path.join(__dirname, './db/db.json'))
  allNotes = JSON.parse(allNotes)
  res.json(allNotes)
});

//Post route
app.post('/api/notes', (req,res)=> {
  let allNotes = fs.readFileSync(path.join(__dirname, './db/db.json'))
  allNotes = JSON.parse(allNotes)
  
  let newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4(),
  };

  allNotes.push(newNote)
  fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes))
  res.json(allNotes)
  
});
// Delete route for notes 
app.delete('/api/notes/:id', (req, res) => {
  let allNotes = fs.readFileSync(path.join(__dirname, './db/db.json'));
  allNotes = JSON.parse(allNotes);

  const noteId = req.params.id;

  // Find the index of the note with the matching id
  const noteIndex = allNotes.findIndex(note => note.id === noteId);

  if (noteIndex !== -1) {
    // Remove the note from the array
    allNotes.splice(noteIndex, 1);

    // Write the updated notes back to the file
    fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes));

    res.json(allNotes);
  } else {
    res.status(404).json({ message: 'Note not found' });
  }
});


//get routes for for notes.html file
app.get('/notes', (req,res) =>{
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('/', (req, res) =>{
   res.sendFile(path.join(__dirname, './public/index.html'))
});

//get route for the index.html file
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname, './public/index.html'))
});


//app listener to initialize the server
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);