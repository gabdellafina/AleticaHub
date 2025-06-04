import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'c2897cb918b120a1f9a429726fc8dede1f7b2033',
  authDomain: 'atleticahub-7b449.firebaseapp.com',
  projectId: 'atleticahub-7b449',
  storageBucket: 'atleticahub-7b449.appspot.com',
  messagingSenderId: 'SEU_SENDER_ID',
  appId: 'SEU_APP_ID',
};

export const app = initializeApp(firebaseConfig);
