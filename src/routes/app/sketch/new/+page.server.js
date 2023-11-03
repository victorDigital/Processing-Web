import { redirect } from "@sveltejs/kit";
import { getFirestore, collection, addDoc } from "firebase/firestore";

export async function load({ cookies }) {
    let user = cookies.get('user');
    let uid = JSON.parse(user).uid;

    //generate a uuid for the sketch
    //thanks https://github.com/firebase/firebase-js-sdk/blob/efe2000fc499e2c85c4e5e0fef6741ff3bad2eb0/packages/util/src/uuid.ts
    const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });

    let docId = uuid();

    //add the sketch to the database
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "sketches"), {
        uid: uid,
        name: "Untitled Sketch",
        id: docId,
        code: "dm9pZCBzZXR1cCgpIHsKICBzaXplKDQwMCw0MDApOwogIC8vIHN0YXJ0dXAgY29kZSBnb2VzIGhlcmUKfQoKdm9pZCBkcmF3KCkgewogIC8vIGxvb3BpbmcgY29kZSBnb2VzIGhlcmUhCn0=", //basic template
        created: Date.now(),
        updated: Date.now()
    });
    console.log("Document written with ID: ", docRef.id);

    

    throw redirect(302, "/app/sketch/" + docId);
};