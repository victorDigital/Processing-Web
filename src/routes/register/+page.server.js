import { superValidate, message } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { firebaseAuth } from '$lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import bcrypt from 'bcrypt';

const schema = z.object({
    username: z.string().min(3).max(32),
    email: z.string().email(),
    password: z.string().min(8).max(32),
    password2: z.string().min(8).max(32),
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

        if (form.data.password != form.data.password2) {
            form.valid = false;
            return message(form, "Passwords do not match");
        }

        //create the user
        let success = false;
        let err = null;
        let user = null;
        try {
            await createUserWithEmailAndPassword(firebaseAuth, form.data.email, form.data.password)
                .then((userCredential) => {
                    // Signed in 
                    user = userCredential.user;
                    success = true;
                });

            //update the user profile
            if (user) {
                await updateProfile(user, {
                    displayName: form.data.username,
                    photoURL: null
                });
            }
        } catch (e) {
            err = e;
        }
        cookies.set('user', JSON.stringify(user), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        if (!success) {
            form.valid = false;
            switch (err.message) {
                case "Firebase: Error (auth/email-already-in-use).":
                    return message(form, "Email already in use");
                default:
                    return message(form, "Error creating user");
            }
        } else {
            return { form };
        }
    }
};