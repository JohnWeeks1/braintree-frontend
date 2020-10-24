<template>
    <div>
        <Nav/>
        <router-view/>
    </div>
</template>

<script>

import Nav from "@/components/structure/Nav";

export default {
    name: 'Account',
    components: {
        Nav
    }
};
</script>
