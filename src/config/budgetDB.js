// This file is responsible for setting up the connection to the PostgreSQL database 
// using Prisma Client. It exports functions to connect and disconnect from the database, 
// as well as the Prisma Client instance itself for use in other parts of the application. 
// The connection string is read from the environment variable `DATABASE_URL`,
//  and error handling is implemented to ensure that any issues with the database connection are logged 
// and handled gracefully.
// This part was a b*tch :)


import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString || typeof connectionString !== "string") {
  throw new Error("DATABASE_URL is missing or not a string");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
    adapter,
    // This will log all queries, errors, and warnings in 
    // development mode, but only errors in production mode.
    log: process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"]
});

// Function to connect to the database + handle connection errors
const connectDB =async() =>{
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully via Prisma Client.");
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
        process.exit(1); // Exit the process with an error code
    }

}
// Disconnect from the database when the application is terminated
const disconnectDB = async() => {
    await prisma.$disconnect();

}

export { connectDB, disconnectDB, prisma };
