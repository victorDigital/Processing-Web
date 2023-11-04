import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

export async function load({ cookies }) {
    
    //get the user cookie
    let user = cookies.get('user');
    let uid = JSON.parse(user).uid;

    //find the user in the database of sketches the uid is the name of the document
    let sketches = [];
    const db = getFirestore();
    const sketchRef = collection(db, "sketches");
    const q = query(sketchRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        sketches.push(doc.data());
    });


    return { sketches };
};