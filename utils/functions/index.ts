import { db } from "@/config/environment/firebase";
import { doc, getDoc } from "firebase/firestore";

const getRole = async (uid: string) => {
  const docRef = doc(db, "Users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

export { getRole };
