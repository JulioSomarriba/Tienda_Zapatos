import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase aquí
const firebaseconfig = {
  apiKey: "AIzaSyAJTnrUOC9j1FLskSDjomU_DGE6S0RYJS4",
  authDomain: "tiendazapatos-248b0.firebaseapp.com",
  projectId: "tiendazapatos-248b0",
  storageBucket: "tiendazapatos-248b0.firebasestorage.app",
  messagingSenderId: "1098692420980",
  appId: "1:1098692420980:web:3d997610a90caf32a33821"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseconfig);
} else {
  app = getApp();
}

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);