const firebase = require('firebase/app');
const firebaseAuth = require("firebase/auth");

const config = {
    apiKey: "AIzaSyAbv-Ru-7tluDdSt9U0R6dkIdQp4mM4SO8",
    authDomain: "pharmacy-handbook.firebaseapp.com",
    projectId: "pharmacy-handbook",
    storageBucket: "pharmacy-handbook.appspot.com",
    messagingSenderId: "1058933971367",
    appId: "1:1058933971367:web:17fcdfe8d51204ccbbfe82",
    measurementId: "G-WRPB5M603L"
};

const firebaseApp = firebase.initializeApp(config);
module.export = firebaseAuth.getAuth(firebaseApp);