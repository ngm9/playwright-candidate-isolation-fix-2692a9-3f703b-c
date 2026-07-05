const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

let candidates = [
  { id: 1, name: 'Alex Rivera', status: 'active' },
  { id: 2, name: 'Morgan Blake', status: 'active' },
];
let nextId = 3;

app.get('/candidates', (_req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'candidates.html'));
});

app.get('/api/candidates', (_req, res) => {
  res.json(candidates.filter(c => c.status === 'active'));
});

app.post('/api/candidates/:id/archive', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const candidate = candidates.find(c => c.id === id);
  if (!candidate) {
    return res.status(404).json({ error: 'Not found' });
  }
  candidate.status = 'archived';
  res.json({ success: true });
});

app.post('/api/test/candidates', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }
  const newCandidate = { id: nextId++, name, status: 'active' };
  candidates.push(newCandidate);
  res.status(201).json(newCandidate);
});

app.delete('/api/test/candidates', (_req, res) => {
  candidates = [];
  nextId = 100;
  res.json({ success: true });
});

const PORT = 3456;
app.listen(PORT, () => {
  console.log(`TalentBridge server running on http://localhost:${PORT}`);
});
