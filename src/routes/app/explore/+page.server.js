import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

export async function load({ cookies }) {
    
    //get the user cookie
    let user = cookies.get('user');
    let uid = JSON.parse(user).uid;

    //find all sketches with public set to true
    let sketches = [];
    const db = getFirestore();
    const sketchRef = collection(db, "sketches");
    const q = query(sketchRef, where("public", "==", "true"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        sketches.push({...doc.data(), uid: ""});
    });

    //return the sketches in order of most likes
    sketches.sort((a,b) => {
        return b.likes - a.likes;
    });

    return { sketches };
};