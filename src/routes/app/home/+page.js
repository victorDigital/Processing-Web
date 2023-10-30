import { authStore } from '../../../stores/authStore.js';
import { redirect } from '@sveltejs/kit';
 
export const load = async () => {
  const unsubscribe = authStore.subscribe((user) => {
    if (!user.uid) {
      throw redirect(302, '/login');
    }
  });
 
  unsubscribe();
 
  return {};
};