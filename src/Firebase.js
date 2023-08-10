import firebase from 'firebase';
 
const firebaseConfig = {
    apiKey: "your api key",
    authDomain: "your credentials",
    projectId: "your credentials",
    storageBucket: "your credentials",
    messagingSenderId: "your credentials",
    appId: "your credentials"
};
   
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
 
export default database;