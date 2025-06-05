const admin = require('firebase-admin');

// Check if Firebase Admin has already been initialized
if (!admin.apps.length) {
  // Use environment variables or fallback to dummy values for development
  const serviceAccount = {
    "type": "service_account",
    "project_id": "atleticahub-7b449",
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID || "private-key-id",
    "private_key": process.env.FIREBASE_PRIVATE_KEY 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
      : "-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQC7VJTUt9Us8cKj\nMzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvu\nNMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZ\n-----END PRIVATE KEY-----\n",
    "client_email": process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-example@atleticahub-7b449.iam.gserviceaccount.com",
    "client_id": process.env.FIREBASE_CLIENT_ID || "client-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.FIREBASE_CERT_URL || "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-example%40atleticahub-7b449.iam.gserviceaccount.com"
  };

  // Initialize the app with a service account, granting admin privileges
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
}

module.exports = admin;
