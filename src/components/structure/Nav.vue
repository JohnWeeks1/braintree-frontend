<template>
    <div>
        <nav class="flex items-center justify-between flex-wrap bg-teal-500 p-6">
            <div class="flex items-center flex-shrink-0 text-white mr-6">
                <span class="font-semibold text-xl tracking-tight">You're logged in!</span>
            </div>
            <div class="block">
                <button @click="logout" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {{ firstName }}, Logout
                </button>
            </div>
        </nav>
    </div>
</template>

<script>

export default {
    name: 'Nav',
    data() {
        return {
            firstName: null
        }
    },
    mounted() {
        this.firstName = this.$store.getters['user/getFirstName'];
    },
    methods: {
        logout() {
            this.$store.dispatch('user/logout')
                .then(() => {
                    this.$router.push({ name: 'Welcome'})
                })
            .catch(error => {
                console.error(error);
            })
        }
    }
}
</script>
