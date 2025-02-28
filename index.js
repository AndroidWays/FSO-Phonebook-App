const express = require('express');
const morgan = require('morgan');
require("dotenv").config();
const app = express();
const cors = require("cors");
const Person = require("./models/person");

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static('dist'))

app.use(morgan('tiny')); // Logging middleware with 'tiny' configuration

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  const person = new Person({ name, number });

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error));
});

// Delete function implementation
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

/* let persons = [
  { "id": 1, "name": "Arto Hellas", "number": "040-123456" },
  { "id": 2, "name": "Ada Lovelace", "number": "39-44-5323523" },
  { "id": 3, "name": "Dan Abramov", "number": "12-43-234345" },
  { "id": 4", "name": "Mary Poppendieck", "number": "39-23-6423122" },
]; */

/* app.get("/api/persons", (req, res) => {
  res.json(persons);
}); */

/*
app.get("/info", (req, res) => {
  res.send(`Phonebook has info for ${persons.length} persons.<br><br>${new Date()}`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: 'Person not found' });
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  const nameExists = persons.some(person => person.name === body.name);

  if (nameExists) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000), // Generate a random ID
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const personToDelete = persons.find(person => person.id === id);

  if (!personToDelete) {
    return res.status(404).send({ error: 'Person not found' });
  }

  persons = persons.filter(person => person.id !== id);
  res.send(`Person with ID ${id} (${personToDelete.name}) has been removed.`);
});
*/

// Middleware to handle unknown endpoints
app.use((req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Malformatted ID' });
  }

  next(error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
