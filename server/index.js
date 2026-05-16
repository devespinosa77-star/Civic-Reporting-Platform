const express = require('express');

const path = require('path');

const db = require('./queries');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;

// API routes (before static files so paths like /reports always hit the API)
app.get('/reports', db.getReports);
app.get('/reports/:id', db.getReportById);
app.post('/reports', db.createReport);
app.patch('/reports/:id/status', db.updateReportStatus);
app.delete('/reports/:id', db.deleteReport);

// Host react app as static files
app.use(express.static(path.resolve(__dirname, '../client/build')));

// SPA entry (after API + static)
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Starting Express on our PORT
app.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}.`)
})
