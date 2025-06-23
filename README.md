Bid Management App

The Bid Management App is a React-based web application for managing construction bids. It allows users to store bids in Firebase Firestore, view a list of bids, download professionally formatted PDF bid sheets, and delete bids. The app features a clean UI with real-time updates and generates print-ready PDFs with a visually appealing layout, including a gradient header, colored text, and structured bid details.
Features

Bid Listing: Display all bids with SO# and Homeowner details, fetched in real-time from Firestore.
PDF Generation: Download bids as PDFs


Prerequisites

Node.js: v16 or higher (node -v).
npm: v8 or higher (npm -v).
Firebase Account: For Firestore database.
Git: To clone the repository.

Setup

Clone the Repository:
git clone 'use the cloneing url'
cd bid-management-app


Install Dependencies:
npm install

Required packages:

react, react-dom
firebase
jspdfOptional (for Material-UI version):

npm install @mui/material @mui/icons-material @emotion/react @emotion/styled


Configure Firebase:

Create a Firebase project at console.firebase.google.com.
Enable Firestore and obtain your Firebase config.
Create src/firebase.js:import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);




Set Up Firestore:

Update Firestore security rules to allow read, write, and delete:rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bids/{bidId} {
      allow read, write, delete: if request.auth != null;
    }
  }
}




Run the App:
npm start



BidsList.jsx: React component for listing bids, fetching from Firestore, downloading PDFs, and deleting bids.

utils.js: Generates PDF bid sheets using jsPDF with a gradient header, colored text, and structured layout.

BidsList.css: CSS for styling the bid list and buttons (blue download, red delete).

firebase.js: Initializes Firebase and exports Firestore instance.