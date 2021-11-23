import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAvHOmUonHYl4BJD1rsC9Ls1Z1VAD7DH4U",
    authDomain: "fir-app-90320.firebaseapp.com",
    projectId: "fir-app-90320",
    storageBucket: "fir-app-90320.appspot.com",
    messagingSenderId: "747978503230",
    appId: "1:747978503230:web:6f4485dd0aa427e94f4d6f"
  };
const firebaseApp = firebase.initializeApp(firebaseConfig)
export default firebaseApp.firestore()
firebase.firestore().settings({ experimentalForceLongPolling: true });