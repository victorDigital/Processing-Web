import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ cookies }) {
    //delete the user cookie
    cookies.set('user', "", {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    throw redirect(302, "/login");
    

    return {};
};