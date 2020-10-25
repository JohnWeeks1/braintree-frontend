<template>
    <div>
        <div v-if="error !== null" class="bg-red-100 border-l-4 border-red-500 text-orange-700 p-4 mb-6" role="alert">
            <p class="font-bold">Be Warned</p>
            <div class="alert alert-danger">{{ error.message }}</div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'DangerAlert',
    props: {
        error: {
            type: Object,
            required: true
        }
    }
};
</script>
