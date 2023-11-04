import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { redirect } from "@sveltejs/kit";

export async function load({ cookies, params }) {
    
    //get the user cookie
    let user = cookies.get('user');
    let uid = JSON.parse(user).uid;

    let id = params.id;

    //find the sketch in the database of sketches the, look for the sketch with the id
    //there should only be one
    const db = getFirestore();
    const sketchRef = collection(db, "sketches");
    const q = query(sketchRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    //list the sketches
    let sketch = null;
    let docId = null;
    querySnapshot.forEach((doc) => {
        sketch = doc.data();
        docId = doc.id;
    });
    if (sketch == null) {
        throw redirect(302, "/app/home");
    }

    // if sketch.uid and uid are different, then return a redirect to the sketch's owner's page
    if (sketch.uid != uid && sketch.public != "true") {
        throw redirect(302, "/app/home");
    }

    //increment the views and update the database
    console.log(sketch);
    sketch.views += 1;
    await updateDoc(doc(db, "sketches", docId), {
        views: sketch.views,
    });

    return { sketch: {...sketch, uid: ""} };
};