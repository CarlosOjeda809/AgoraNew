<script setup>
import Navbar from './pages/navbar.vue';
import authHandler from '@/composables/oauth'

const router = useRouter()
router.beforeEach(async (to, from) => {
  await authHandler(to, from)
})

</script>

<template>
  <div>
<Navbar />
    <div class="mt-14">
      <NuxtPage />
    </div>
    

  </div>
</template>
