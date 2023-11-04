import { collection, getFirestore, doc, query, where, updateDoc, getDocs } from "firebase/firestore";


export async function PUT({request, cookies }) {
    //log the headers
    let b64Code = request.headers.get('code');
    let uid = request.headers.get('Authorization');
    let sketchId = request.headers.get('Sketch');
    let Name = request.headers.get('Name');

    let userUid = JSON.parse(cookies.get('user')).uid;
    if (userUid != uid) {
        return new Response("Unauthorized", { status: 401 });
    }

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

    await updateDoc(doc(db, "sketches", docId), {
        code: b64Code,
        updated: Date.now(),
        name: Name,
    });

    return new Response();
};