// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\src\server\index.ts
// Server Entry Point - Start the AtleticaHub API Server

import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import App from './app';

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Connect to Firebase emulators in development
if (process.env.NODE_ENV !== 'production') {
  try {
    // Connect to Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('🔥 Connected to Firestore Emulator');
  } catch (error) {
    console.log('⚠️  Firestore Emulator connection failed (already connected or emulator not running)');
  }

  try {
    // Connect to Auth emulator
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.log('🔐 Connected to Auth Emulator');
  } catch (error) {
    console.log('⚠️  Auth Emulator connection failed (already connected or emulator not running)');
  }
}

// Start server
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = new App(PORT);

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('💤 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('💤 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('💥 Unhandled Promise Rejection:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('💥 Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// Start the server
server.listen();

export default server;
