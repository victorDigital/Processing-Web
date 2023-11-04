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

    //create a random name from a adjective and a noun
    let name = "";
    const adjectives = ["flowery", "absent", "modern", "second-hand", "internal", "delicious", "different", "foregoing", "unnatural", "understood", "married", "pathetic", "swanky", "wild", "protective", "hard-to-find", "jumpy", "disastrous", "detailed", "half", "versed", "voracious", "mysterious", "average", "tasty", "superb", "vacuous", "well-made", "mindless", "clear", "amusing", "literate", "heartbreaking", "hurried", "hilarious", "polite", "old", "dynamic", "furtive", "thoughtful", "undesirable", "longing", "outgoing", "poor", "interesting", "godly", "clean", "assorted", "flimsy", "amused", "stereotyped", "vigorous", "pushy", "colorful", "graceful", "flagrant", "rigid", "bouncy", "plain", "spotless", "opposite", "well-off", "handy", "sick", "fine", "rural", "optimal", "irate", "groovy", "aquatic", "offbeat", "long", "ordinary", "cool", "rustic", "towering", "shivering", "highfalutin", "worthless", "damp", "cloistered", "questionable", "onerous", "abandoned", "pleasant", "calm", "dizzy", "deep", "ancient", "nappy", "unequal", "immense", "verdant", "scrawny", "adamant", "brash", "sincere", "round", "animated", "feeble"];
    const noun = ["pizzas", "quartz", "bells", "measure", "word", "crowd", "bomb", "dust", "pig", "color", "mine", "straw", "field", "friends", "linen", "payment", "water", "drink", "road", "swing", "house", "shirt", "amusement", "baseball", "plate", "shame", "harbor", "horses", "whistle", "seashore", "cherries", "gate", "dog", "mice", "stamp", "reason", "yoke", "profit", "animal", "zinc", "cows", "flag", "line", "toe", "stitch", "baby", "meat", "order", "scissors", "stop", "needle", "hobbies", "rainstorm", "spring", "jail", "distribution", "throat", "rings", "ants", "yam", "lock", "limit", "pull", "week", "thrill", "language", "seed", "expert", "end", "eye", "glove", "humor", "cover", "reaction", "fish", "snails", "stick", "meeting", "powder", "country", "collar", "locket", "badge", "planes", "example", "writer", "wren", "sticks", "poison", "knowledge", "bulb", "land", "stove", "sack", "society", "achiever", "caption", "toy", "fruit", "bat"];

    name = adjectives[Math.floor(Math.random() * adjectives.length)] + " " + noun[Math.floor(Math.random() * noun.length)];
    name = name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

    //add the sketch to the database
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "sketches"), {
        uid: uid,
        name: name,
        id: docId,
        code: "dm9pZCBzZXR1cCgpIHsKICBzaXplKDQwMCw0MDApOwogIC8vIHN0YXJ0dXAgY29kZSBnb2VzIGhlcmUKfQoKdm9pZCBkcmF3KCkgewogIC8vIGxvb3BpbmcgY29kZSBnb2VzIGhlcmUhCn0=", //basic template
        created: Date.now(),
        updated: Date.now(),
        maker: JSON.parse(user).displayName,
        public: false,
        views: 0,
        likes: 0,
        comments: [],
        usersLiked: {},
    });

    

    throw redirect(302, "/app/sketch/" + docId);
};