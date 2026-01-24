import "module-alias/register";
import mongoose from "mongoose";
import app from "../src/app";
import env from "../src/util/validateEnv";
import s3 from "../src/aws/s3Client"; // Import your S3 client instance
import { ListBucketsCommand } from "@aws-sdk/client-s3";

const PORT = env.PORT;
const MONGODB_URI = env.MONGODB_URI;

// Verify S3 connection
async function verifyS3Connection() {
  try {
    await s3.send(new ListBucketsCommand({}));
    console.log("AWS S3 connected!");
  } catch (error) {
    console.warn(
      "⚠️  Warning: AWS S3 connection failed. S3 features (like logo uploads) will not work.",
    );
    console.warn(
      "   Error details:",
      error instanceof Error ? error.message : error,
    );
    console.warn("   To fix: Update your AWS credentials in the .env file");
    // Don't throw - allow server to start without S3 for local development
    // throw new Error("Failed to connect to AWS S3.");
  }
}

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Mongoose connected!");

    // Verify AWS S3 connection
    await verifyS3Connection();

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Server initialization error:", error);
    process.exit(1); // Exit the process with an error code if initialization fails
  }
}

// Start the server
startServer();
