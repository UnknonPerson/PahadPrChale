import dotenv from 'dotenv';
import connectDB from './db/connect.js';
import app from './app.js';

// Load environment variables
dotenv.config();

// Port configuration
const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`
        ╔══════════════════════════════════════════╗
        ║                                          ║
        ║   PahadPerChale Backend Server           ║
        ║   Your Personalized North East Travel   ║
        ║                                          ║
        ║   Server running on port ${PORT}           ║
        ║   Environment: ${process.env.NODE_ENV || 'development'}        ║
        ║                                          ║
        ║   API: http://localhost:${PORT}/api        ║
        ║                                          ║
        ╚══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
