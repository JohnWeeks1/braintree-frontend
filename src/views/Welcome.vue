<template>
  <div>
      <div class="flex content-center flex-wrap h-screen">
          <div class="mx-auto">
              <router-link :to="{ name: 'Login' }" class="bg-red-700 hover:bg-red-500 text-white text-2xl py-4 px-6 mx-4">
                  Login
              </router-link>
              <router-link :to="{ name: 'Register' }" class="bg-red-700 hover:bg-red-500 text-white text-2xl py-4 px-6">
                  Register
              </router-link>
          </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'Welcome',
}
</script>
