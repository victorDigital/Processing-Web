import { collection, getFirestore, doc, query, where, updateDoc, getDocs } from "firebase/firestore";


export async function PUT({request}) {
    //log the headers
    let b64Code = request.headers.get('code');
    let uid = request.headers.get('Authorization');
    let sketchId = request.headers.get('Sketch');
    let Name = request.headers.get('Name');

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
        code: b64Code,
        updated: Date.now(),
        name: Name,
    });



    console.log(uid,sketchId);
    return new Response();
};