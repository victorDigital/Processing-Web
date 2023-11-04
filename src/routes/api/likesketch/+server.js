import { collection, getFirestore, doc, query, where, updateDoc, getDocs } from "firebase/firestore";


export async function PUT({request}) {
    //log the headers
    let uid = request.headers.get('Authorization');
    let sketchId = request.headers.get('Sketch');

    //like the sketch in the database and add the user to the list of users who liked it
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
    
    let usersLiked = sketch.usersLiked;
    let totalLikes = sketch.likes;
    
    //the usersLiked object is a map of users who liked the sketch, the uid is the key and the value is true
    //if the user has already liked the sketch, unlike it
    let keys = Object.keys(usersLiked);
    if (keys.includes(uid)) {
        //remove the user from the list of users who liked the sketch
        delete usersLiked[uid];
        totalLikes--;
    } else {
        usersLiked[uid] = true;
        totalLikes++;
    }

    await updateDoc(doc(db, "sketches", docId), {
        usersLiked: usersLiked,
        likes: totalLikes,
    });

    return new Response();
};