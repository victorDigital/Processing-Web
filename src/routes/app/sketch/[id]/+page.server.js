import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

export async function load({ cookies, params }) {
    
    //get the user cookie
    let user = cookies.get('user');
    let uid = JSON.parse(user).uid;

    let id = params.id;

    //find the sketch in the database of sketches the, look for the sketch with the id
    //there should only be one
    const db = getFirestore();
    const sketchRef = collection(db, "sketches");
    console.log(id);
    const q = query(sketchRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    //list the sketches
    let sketch = null;
    querySnapshot.forEach((doc) => {
        sketch = doc.data();
    });
    console.log(sketch);

    return { sketch };
};