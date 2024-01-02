import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzs6_pWG8XXQIuR8Pjzds1wICKKGh_RQc",
  authDomain: "campusguru-22680.firebaseapp.com",
  projectId: "campusguru-22680",
  storageBucket: "campusguru-22680.appspot.com",
  messagingSenderId: "612397578209",
  appId: "1:612397578209:web:c17d16a1ffc1217e2ec4a0",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
