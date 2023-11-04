import { collection, getFirestore, doc, query, where, updateDoc, getDocs } from "firebase/firestore";


export async function PUT({request}) {
    //log the headers
    let uid = request.headers.get('Authorization');
    let sketchId = request.headers.get('Sketch');
    let visibility = request.headers.get('Visibility');
    console.log(visibility);

    //update the sketch in the database
    const db = getFirestore();
    const sketchRef = collection(db, "sketches");
    const q = query(sketchRef, where("id", "==", sketchId));
    const querySnapshot = await getDocs(q);
    //list the sketches
    let sketch = null;
    let docId = null;
    querySnapshot.forEach((doc) => {
        sketch = doc.data();
        docId = doc.id;
    });
    console.log(docId);
    await updateDoc(doc(db, "sketches", docId), {
        updated: Date.now(),
        public: visibility,
    });

    console.log(sketchId, visibility);
    return new Response();
};