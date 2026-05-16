// Connect to Postgres using the node-postgres package
const Pool = require('pg').Pool;

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: 'me',
      host: 'localhost',
      database: 'api',
      password: 'password',
      port: 5432,
    });

// CREATE, READ, UPDATE, DELETE
const getReports = (request, response) => {
  pool.query('SELECT * FROM reports ORDER BY created_at DESC, id DESC', (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }
    return response.status(200).json(results.rows);
  });
};

const getReportById = (request, response) => {
  const id = parseInt(request.params.id, 10);

  if (Number.isNaN(id)) {
    return response.status(400).json({ error: 'Invalid report id' });
  }

  return pool.query('SELECT * FROM reports WHERE id = $1', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }

    if (results.rows.length === 0) {
      return response.status(404).json({ error: 'Report not found' });
    }

    return response.status(200).json(results.rows[0]);
  });
};

const createReport = (request, response) => {
  const { title, description, category, location_text, latitude, longitude, status } = request.body;

  if (!title || !description || !category || !location_text) {
    return response.status(400).json({
      error: 'title, description, category, and location_text are required',
    });
  }

  return pool.query(
    'INSERT INTO reports (title, description, category, location_text, latitude, longitude, status) VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, \'open\')) RETURNING id',
    [title, description, category, location_text, latitude || null, longitude || null, status || null],
    (error, results) => {
      if (error) {
        return response.status(500).json({ error: error.message });
      }

      return response.status(201).json({
        message: `Report created with ID: ${results.rows[0].id}`,
        id: results.rows[0].id,
      });
    }
  );
};

const updateReportStatus = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const { status } = request.body;
  const validStatuses = ['open', 'in_progress', 'resolved'];

  if (Number.isNaN(id)) {
    return response.status(400).json({ error: 'Invalid report id' });
  }

  if (!validStatuses.includes(status)) {
    return response.status(400).json({ error: 'Status must be open, in_progress, or resolved' });
  }

  return pool.query(
    'UPDATE reports SET status = $1 WHERE id = $2 RETURNING *',
    [status, id],
    (error, results) => {
      if (error) {
        return response.status(500).json({ error: error.message });
      }

      if (results.rows.length === 0) {
        return response.status(404).json({ error: 'Report not found' });
      }

      return response.status(200).json(results.rows[0]);
    }
  );
};

const deleteReport = (request, response) => {
  const id = parseInt(request.params.id, 10);

  if (Number.isNaN(id)) {
    return response.status(400).json({ error: 'Invalid report id' });
  }

  return pool.query('DELETE FROM reports WHERE id = $1 RETURNING *', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message });
    }

    if (results.rows.length === 0) {
      return response.status(404).json({ error: 'Report not found' });
    }

    return response.status(200).json({ message: 'Report deleted', report: results.rows[0] });
  });
};

module.exports = {
  getReports,
  getReportById,
  createReport,
  updateReportStatus,
  deleteReport,
}
