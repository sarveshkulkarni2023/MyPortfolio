export function errorHandler(err, _req, res, _next) {
  // Log details securely on the server side
  console.error('[System Error]', {
    message: err.message,
    name: err.name,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors?.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with this value already exists' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }

  const status = err.status || err.statusCode || 500;
  
  // Safe default: only leak error message in development mode
  res.status(status).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
}
