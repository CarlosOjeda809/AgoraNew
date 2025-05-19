<script setup>
const client = useSupabaseClient();
const router = useRouter();
const isMenuOpen = ref(false);
const errorMsg = ref('');
const userName = ref('');


function goBack() {
  router.back(-1)
};

function goToIndex() {
  router.push('/');
};

const openMenu = () => {
  isMenuOpen.value = true;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const logout = async () => {
  const { error } = await client.auth.signOut();
  if (error) {
    errorMsg.value = error.message;
    console.error('Error al cerrar sesión:', error);
  } else {
    userName.value = '';
    errorMsg.value = '';
    window.location.href = '/login';
  }
};

const navigateTo = (path) => {
  router.push(path);
  closeMenu();
};
</script>

<template>
  <div class="bg-gray-100 py-4 px-4 flex justify-between items-center shadow-md fixed top-0 left-0 right-0 z-30">
    <button @click="goBack" :data-route="backRoute"
      class="bg-white hover:-translate-y-0.5 cursor-pointer border-1 border-gray-300/50 text-gray-700 font-bold py-2 px-4 rounded-full shadow-sm transition duration-400">
      <Icon name="material-symbols-light:arrow-back" class="text-2xl align-middle" />
    </button>

    <button @click="goToIndex"
      class="bg-white hover:-translate-y-0.5 cursor-pointer text-white font-bold py-2 px-4 rounded-full shadow-sm transition duration-400">
      <Icon name="ic:round-home" class="text-2xl text-black align-middle" />
    </button>

    <button @click="openMenu" class="focus:outline-none bg-white p-1 cursor-pointer duration-400 hover:-translate-y-0.5 rounded-full">
      <Icon name="basil:menu-outline" class="text-4xl text-black transition  align-middle" />
    </button>
  </div>

  <Transition name="fade">
    <div v-if="isMenuOpen" @click="closeMenu"
      class="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-20 transition-opacity duration-300 ease-in-out">
    </div>
  </Transition>

  <Transition name="slide-in">
    <div v-if="isMenuOpen"
      class="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-30">
      <div class="p-4 flex justify-end">
        <NuxtLInk @click="closeMenu" class="focus:outline-none">
          <Icon name="heroicons:x-mark" class="text-2xl text-gray-700 hover:text-gray-900 transition duration-200" />
        </NuxtLInk>
      </div>
      <nav class="mt-6">
        <button @click="logout"
          class="block py-3 px-6 shadow border-b-0.5 cursor-pointer border-gray-200 text-gray-800 hover:bg-gray-100 transition-colors duration-500 w-full text-left focus:outline-none">
          Cerrar Sesión
        </button>
        <NuxtLink to="/profile" 
          class="block py-3 px-6 shadow border-b-0.5 cursor-pointer border-gray-200 text-gray-800 hover:bg-gray-100 transition-colors duration-500 w-full text-left focus:outline-none">
          Mi Perfil
        </NuxtLink>
      </nav>
    </div>
  </Transition>
</template>

<style scoped>
.slide-in-enter-from {
  transform: translateX(100%);
}
.slide-in-enter-active,
.slide-in-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-in-leave-to {
  transform: translateX(100%);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
</style>