<script setup>
const client = useSupabaseClient()
const router = useRouter()
const config = useRuntimeConfig();
const emailData = ref('')
const contraseñaData = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

const loginDatos = async () => {
  if (!emailData.value || !contraseñaData.value) {
    errorMsg.value = 'Rellena todos los campos';
    return false;
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: emailData.value,
    password: contraseñaData.value,
  });

  if (error) {
    console.error('Error al iniciar sesión:', error);
    errorMsg.value = error.message;
    return false;
  }

  errorMsg.value = ''
  navigateTo('/')
}

const loginConGoogle = async () => {
    isLoading.value = true;
    try {
        const { error } = await client.auth.signInWithOAuth({
            provider: 'google',
             options: {
                 redirectTo: config.public.BASE_URL + '/callback'
             }

        });

        if (error) {
            console.error('Error al iniciar sesión con Google:', error);
            errorMsg.value = error.message;
            return false;
        }

        errorMsg.value = ''
    } catch (e) {
        errorMsg.value = 'Error inesperado. Inténtalo de nuevo.' + e
    } finally {
        isLoading.value = false;
    }
}

</script>

<template>
  <main class="bg-gray-200 min-h-screen flex flex-col relative overflow-hidden">
    <header class="p-4 items-center ">
      <img src="/img/logoagora.png" class="mx-auto w-3/3 sm:w-1/3 md:w-1/4 h-auto mt-10" alt="Logo Agora" />
    </header>
    <section class="flex-grow flex justify-center px-7">
      <form @submit.prevent="loginDatos" class="w-full space-y-8 rounded-lg mb-60 max-w-xl">
        <input v-model="emailData" type="email" placeholder="Email"
          class="text-gray-500 p-3 bg-gray-100 shadow-sm rounded-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-300" />
        <input v-model="contraseñaData" type="password" placeholder="Contraseña"
          class="text-gray-500 p-3 bg-gray-100 shadow-sm rounded-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-300" />
        <button type="submit"
          class="p-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-800 w-full transition duration-300 cursor-pointer">
          INGRESAR
        </button>
        <button type="button" @click="loginConGoogle"
          class="p-3 bg-white text-gray-600 font-semibold rounded-md hover:bg-gray-100 w-full transition duration-300 cursor-pointer">
          LOGIN CON GOOGLE
        </button>
        <div class="text-center">
          <p class="text-gray-600">¿No tienes cuenta?</p>
          <a @click="navigateTo('/register')" class="text-blue-700 font-semibold cursor-pointer hover:underline">Crear
            una</a>
        </div>
        <p v-if="errorMsg" class="text-center text-red-500 font-semibold">{{ errorMsg }}</p>
      </form>
    </section>
  </main>
</template>