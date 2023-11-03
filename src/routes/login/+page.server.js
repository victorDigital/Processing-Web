import { superValidate, message } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { firebaseAuth } from '$lib/firebase';
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import bcrypt from 'bcrypt';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(32),
});

export const load = async () => {
    let form = await superValidate(schema);
    return { form };
};

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            return fail(400, { form });
        }

        //create the user
        let success = false;
        let err = null;
        let user = null;
        try {
            await signInWithEmailAndPassword(firebaseAuth, form.data.email, form.data.password)
                .then((userCredential) => {
                    // Signed in 
                    user = userCredential.user;
                    success = true;
                });
        } catch (e) {
            err = e;
        }
        cookies.set('user', JSON.stringify(user), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        if (!success) {
            form.valid = false;
            console.log(err.message);
            switch (err.message) {
                case "Firebase: Error (auth/invalid-login-credentials).":
                    return message(form, "Wrong password or email");
                default:
                    return message(form, "Error logging in");
            }
        } else {
            return { form };
        }
    }
};