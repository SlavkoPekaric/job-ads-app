const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = 3002;

// Set up middleware
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

// Load local mock data into memory
let db = JSON.parse(fs.readFileSync('src/assets/db/db.json'));

/**
 * @typedef {Object} JobAd
 * @property {number} id - The ID of the job ad.
 * @property {string} title - The title of the job ad.
 * @property {string} description - The description of the job ad.
 * @property {string} createdAt - The creation date of the job ad.
 * @property {string} updatedAt - The last updated date of the job ad.
 */

/**
 * @typedef {Object} Invoice
 * @property {number} id - The ID of the invoice.
 * @property {number} jobAdId - The ID of the associated job ad.
 * @property {string} description - The description of the invoice.
 * @property {string} createdAt - The creation date of the invoice.
 * @property {string} updatedAt - The last updated date of the invoice.
 */

/**
 * Provides all data from the db json file.
 * @name /mock-data
 * @function
 * @memberof module:routes
 */
app.get('/mock-data', (req, res) => {
  res.json(db);
});

/**
 * Provides all the jobs data from the db json file.
 * @name /mock-data/jobs
 * @function
 * @memberof module:routes
 */
app.get('/mock-data/jobs', (req, res) => {
  console.log(`Fetching: ${db.jobs}`);

  if (req.query && req.query.keyword) {
    console.log(req.query.keyword.toLowerCase());

    const filteredJobs = db.jobs.filter(item => item.title.toLowerCase().includes(req.query.keyword.toLowerCase()));
    res.json(filteredJobs);
  } else {
    res.json(db.jobs);
  }
});

/**
 * Provides a single job data from the db json file by filtering the jobs data. Returns 404 error if no match.
 * @name /mock-data/jobs/:id
 * @function
 * @memberof module:routes
 */
app.get('/mock-data/jobs/:id', (req, res) => {
  const job = db.jobs.find(j => j.id === parseInt(req.params.id));
  if (job) {
    res.json(job);
  } else {
    res.status(404).send({ error: 'Job not found' });
  }
});

/**
 * Appends a new entry to the collection under "jobs" in the mock db json.
 * @name /mock-data/jobs
 * @function
 * @memberof module:routes
 */
app.post('/mock-data/jobs', (req, res) => {
  // Find highest available id, simulate auto-increment
  let nextId = 0;
  if (db.jobs.length) {
    nextId = Math.max.apply(null, db.jobs.map(i => parseInt(i.id))) + 1;
  }

  const newJob = {
    ...req.body,
    id: nextId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.jobs.push(newJob);
  // fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  res.status(201).json(newJob);
});

/**
 * Edits a single job data from the db json file by filtering the jobs data. Returns 404 error if no match.
 * @name /mock-data/jobs/:id
 * @function
 * @memberof module:routes
 */
app.put('/mock-data/jobs/:id', (req, res) => {
  const jobIndex = db.jobs.findIndex(item => item.id === parseInt(req.params.id));

  if (jobIndex !== -1) {
    const updatedJob = {
      ...db.jobs[jobIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    db.jobs[jobIndex] = updatedJob;
    // fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
    res.json(updatedJob);
  } else {
    res.status(404).send({ error: 'Job not found' });
  }
});

/**
 * Deletes a single job data from the db json file by filtering the jobs data. Returns 404 error if no match.
 * @name /mock-data/jobs/:id
 * @function
 * @memberof module:routes
 */
app.delete('/mock-data/jobs/:id', (req, res) => {
  const jobIndex = db.jobs.findIndex(item => item.id === parseInt(req.params.id));
  if (jobIndex !== -1) {
    db.jobs.splice(jobIndex, 1);
    // fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
    res.status(204).send();
  } else {
    res.status(404).send({ error: 'Job not found' });
  }
});

/**
 * Provides all invoices data from the db json file.
 * @name /mock-data/invoices
 * @function
 * @memberof module:routes
 */
app.get('/mock-data/invoices', (req, res) => {
  res.json(db.invoices);
});

/**
 * Appends a new entry to the collection under "invoices" in the mock db json.
 * @name /mock-data/invoices
 * @function
 * @memberof module:routes
 */
app.post('/mock-data/invoices', (req, res) => {
  // Find highest available id, simulate auto-increment
  let nextId = 0;
  if (db.invoices.length) {
    nextId = Math.max.apply(null, db.invoices.map(i => parseInt(i.id))) + 1;
  }

  const newInvoice = {
    ...req.body,
    id: nextId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  console.log('newInvoice');
  console.log(newInvoice);

  db.invoices.push(newInvoice);
  // fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  res.status(201).json(newInvoice);
});

/**
 * Deletes invoices associated with a specific job ad ID from the db json file. Returns 404 error if no match.
 * @name /mock-data/invoices/:jobAdId
 * @function
 * @memberof module:routes
 */
app.delete('/mock-data/invoices/:jobAdId', (req, res) => {
  const invoicesToDelete = db.invoices.filter(item => item.jobAdId === parseInt(req.params.jobAdId));

  if (invoicesToDelete.length !== -1) {
    db.invoices = db.invoices.filter(item => item.jobAdId !== parseInt(req.params.jobAdId));
    // fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
    res.status(204).send();
  } else {
    res.status(404).send({ error: `No invoice found with jobAdId of "${req.params.jobAdId}"` });
  }
});

/**
 * Middleware to handle 404 for undefined routes.
 * @name *
 * @function
 * @memberof module:routes
 */
app.use((req, res) => {
  res.status(404).send({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
