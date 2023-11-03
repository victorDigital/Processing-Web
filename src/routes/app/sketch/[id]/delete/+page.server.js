import { redirect } from "@sveltejs/kit";
import { collection, getFirestore, doc, query, where, getDocs, deleteDoc } from "firebase/firestore";
export async function load({ params }) {
    let id = params.id;
    const db = getFirestore();
    const sketchRef = collection(db, "sketches");
    //find the sketch in the database of sketches the, look for the sketch with the id
    //there should only be one
    const q = query(sketchRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    //list the sketches
    let sketch = null;
    let docId = null;
    querySnapshot.forEach((doc) => {
        sketch = doc.data();
        docId = doc.id;
    });
    console.log(docId);
    await deleteDoc(doc(db, "sketches", docId));
    throw redirect(302, "/app/home");
};