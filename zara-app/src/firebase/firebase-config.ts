// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: 'AIzaSyBBKsBG7FsKIuhukfRd-yy6a9vG6ZS8doA',

  authDomain: 'zara-images.firebaseapp.com',

  projectId: 'zara-images',

  storageBucket: 'zara-images.appspot.com',

  messagingSenderId: '227604264024',

  appId: '1:227604264024:web:bcfddf78e07d7a957c062d',

  measurementId: 'G-4BV5Z5ZF78',
};

// Initialize Firebase
export const fireBaseapp = initializeApp(firebaseConfig);
export const fireBaseAnalytics = getAnalytics(fireBaseapp);