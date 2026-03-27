require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const statsRoutes = require('./routes/stats');

const app = express();

// Connect to MongoDB
connectDB();

// ── Middleware ──────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow: no origin (Postman/curl), localhost (dev), configured CLIENT_URL,
      // and any *.vercel.app, *.netlify.app, *.railway.app, *.fly.dev deployment URL
      if (
        !origin ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        /\.vercel\.app$/.test(origin) ||
        /\.netlify\.app$/.test(origin) ||
        /\.railway\.app$/.test(origin) ||
        /\.fly\.dev$/.test(origin) ||
        origin === (process.env.CLIENT_URL || '')
      ) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/posts', postRoutes);
apiRouter.use('/posts', commentRoutes); // nested: /posts/:id/comments
apiRouter.use('/stats', statsRoutes);

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Support both `/api/*` (local/typical) and `/*` (Netlify redirect strips `/api`)
app.use('/api', apiRouter);
app.use('/', apiRouter);

// ── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;

