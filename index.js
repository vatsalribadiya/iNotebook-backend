const connectToMongo = require('./db');
const express = require('express');

connectToMongo();
const app = express()
const port = 6000;
app.use(express.json());

//available routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/note', require('./routes/note.js'));

//test API
app.get('/', (req, res) => {
  res.send('Hello Vatsal!')
})
app.listen(port, () => {
  console.log(`iNotebook app listening on port http://localhost:${port}`)
})