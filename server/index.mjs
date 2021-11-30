// @ts-check
import express from 'express';
import {
  addContact,
  editContact,
  getAllContacts,
  getContact,
  removeContact,
  // @ts-ignore
} from './service.mjs';

const app = express();

app.use(express.json());

app.get('/api/contact-list', (_req, res) => {
  const { data } = getAllContacts();
  const list = data.map(({ id, firstName, lastName, location }) => ({
    id,
    firstName,
    lastName,
    location,
  }));

  setTimeout(() => {
    res.send(list);
  }, 1000);
});

app.post('/api/contact', (req, res) => {
  const id = addContact(req.body);

  setTimeout(() => {
    res.status(200);
    res.send({
      id,
    });
  }, 1000);
});

app.get('/api/contact/:id', (req, res) => {
  const id = Number(req.params.id);
  const contact = getContact(id);

  setTimeout(() => {
    if (contact) {
      res.status(200);
      res.send(contact);
    } else {
      res.status(404);
      res.send();
    }
  }, 1000);
});

app.delete('/api/contact/:id', (req, res) => {
  const id = Number(req.params.id);
  const removed = removeContact(id);

  setTimeout(() => {
    if (removed) {
      res.status(200);
      res.send();
    } else {
      res.status(404);
      res.send();
    }
  }, 2000);
});

app.patch('/api/contact/:id', (req, res) => {
  const id = Number(req.params.id);
  const success = editContact(id, req.body);

  setTimeout(() => {
    if (success) {
      res.status(200);
      res.send();
    } else {
      res.status(404);
      res.send();
    }
  }, 2000);
});

app.use('/', (_req, res) => {
  res.send('Address Book API');
});

const port = process.env.PORT || 9999;

app.listen(port, () => {
  console.log(`Address Book API server listening at http://localhost:${port}`);
});
