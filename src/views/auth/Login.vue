<template>
    <div>
        <div class="pt-32 pb-48 min-h-screen">
            <div class="w-full p-6 flex justify-center items-center">
                <div class="w-full max-w-xs">
                    <form class="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-opacity-25">
                        <div class="mb-4">
                            <div class="text-3xl font-bold pb-5">Login</div>
                            <input v-model="email" class="shadow text-black appearance-none border rounded w-full py-2 px-3 mb-3
                            leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email">
                            <p class="text-red-500 text-xs italic" v-if="errors && errors.email">
                                {{ errors.email[0] }}</p>
                        </div>
                        <div class="mb-6">
                            <input v-model="password" class="shadow text-black appearance-none border rounded w-full py-2 px-3 mb-3
                            leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************">
                            <p class="text-red-500 text-xs italic" v-if="errors && errors.password">
                                {{ errors.password[0] }}</p>
                        </div>
                        <div class="flex items-center justify-between">
                            <button @click="login" class="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none
                                focus:shadow-outline" type="button">
                                Sign In
                            </button>
                            <router-link :to="{ name: 'Welcome' }" class="no-underline hover:underline hover:text-blue-300 text-blue-500 text-lg" type="button">
                                Back
                            </router-link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';

export default {
    name: 'Login',
    data() {
        return {
            errors: null,
            email: null,
            password: null
        }
    },
    methods: {
        async login() {
            await axios.get('sanctum/csrf-cookie')
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });

            await axios.post('api/login', {
                email: this.email,
                password: this.password
            })
                .then(() => {
                    this.fetchUser();
                })
                .catch(error => {
                    this.errors = error.response.data.errors;
                });
        },

        async fetchUser() {
            await this.$store.dispatch('user/fetchUser')
                .then(() => {
                    this.$router.push({name: 'Payment'})
                })
        }
    },
}
</script>
