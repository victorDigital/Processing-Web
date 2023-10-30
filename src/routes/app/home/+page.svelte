<script>
    import { authStore } from '../../../stores/authStore.js';
    console.log($authStore)
</script>

hi {$authStore.currentUser?.email}!