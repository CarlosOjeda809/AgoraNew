<script setup>
const session = useSupabaseSession();
onMounted(async() => {
    console.log(session.value)

    if (session?.value?.user){
        navigateTo('/')
    }

    else {
        navigateTo('/login  ')
    }
})
</script>

<template>
    
</template>

<style lang="postcss" scoped>
    
</style>
