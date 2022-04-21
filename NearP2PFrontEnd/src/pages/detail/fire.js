import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

/*
const firebaseConfig = {
  apiKey: "AIzaSyCf48EMlPj8CnlhuKUXu2F_gtrwxP0l1Ik",
  authDomain: "near-p2p-chat.firebaseapp.com",
  databaseURL: "https://near-p2p-chat-default-rtdb.firebaseio.com",
  projectId: "near-p2p-chat",
  storageBucket: "near-p2p-chat.appspot.com",
  messagingSenderId: "344729762075",
  appId: "1:344729762075:web:676ce824168cec09757bbe"
};*/


const firebaseConfig = {
  apiKey: "AIzaSyCEDG7t9UpmiNWsjPyd_rwucL_s2ppexLk",
  authDomain: "chat-near-dex.firebaseapp.com",
  databaseURL: "https://chat-near-dex-default-rtdb.firebaseio.com",
  projectId: "chat-near-dex",
  storageBucket: "chat-near-dex.appspot.com",
  messagingSenderId: "601318580099",
  appId: "1:601318580099:web:ea212ac3d89f8ef24ae0b6"
};




firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore();
