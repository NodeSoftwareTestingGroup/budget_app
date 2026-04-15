//This is the main entry point of our application. It sets up the Express server, 
// connects to the database, and defines the API routes for our budget app. 
// It also includes error handling for unhandled promise rejections and uncaught exceptions,
//  as well as a graceful shutdown mechanism to ensure that the database connection is properly closed 
// when the server is stopped.



import express from 'express';
import {config} from 'dotenv';
import "dotenv/config";
import { connectDB, disconnectDB } from './config/budgetDB.js';
const app = express();

const port = 5001;

//import routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

config();
connectDB();    

// Body parser middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

//Api routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Auth - Signing and Sign up
//User Profile - Dashboard
//Budget Page


// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});