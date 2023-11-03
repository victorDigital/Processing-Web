/** @type {import('./$types').PageServerLoad} */
import { firebaseAuth } from '$lib/firebase';
import { getAuth } from "firebase/auth";
import { redirect } from "@sveltejs/kit";


export async function load({ request, cookies }) {
    //get the user cookie
    let user = cookies.get('user');

    //if the user cookie is not set, redirect to login
    if (!user) {
        let prevUrl = request.url;
        throw redirect(302, "/login?redirect=" + encodeURIComponent(prevUrl));
    }

    const auth = getAuth();
    if (auth.currentUser) {
        console.log(auth.currentUser.uid);
    } else {
        let prevUrl = request.url;
        throw redirect(302, "/login?redirect=" + encodeURIComponent(prevUrl));
    }

    return {user: JSON.parse(user)};
};