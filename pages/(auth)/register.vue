<script setup>

const nombreData = ref('');
const emailData = ref('');
const contraseñaData = ref('');
const newContraseñaData = ref('');

const {
    signup,
    mostrarDatos,
    errorMsg,
} = useAuth();

onMounted(async () => {
    await mostrarDatos();

});

</script>
<template>
    <main class="bg-gray-200 min-h-screen flex flex-col items-center">
        <header class="p-4 items-center ">
            <img src="/img/logoagora.png" class="mx-auto w-3/3 sm:w-1/3 md:w-1/4 h-auto mt-10" alt="Logo Agora" />
        </header>
        <section class="flex-grow flex justify-center px-4 sm:px-0">
            <form @submit.prevent="signup(nombreData, emailData, contraseñaData, newContraseñaData)"
                class="w-full max-w-xl p-6 sm:p-8 space-y-4 rounded-lg mb-16 sm:mb-60">
                <input v-model="nombreData" type="text" placeholder="Nombre"
                    class="bg-gray-100 text-gray-500 w-full p-3 shadow-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-300" />
                <input v-model="emailData" type="email" placeholder="Email"
                    class="bg-gray-100 p-3 shadow-sm rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-300 text-gray-500" />
                <input v-model="contraseñaData" type="password" placeholder="Contraseña"
                    class="text-gray-500 bg-gray-100 p-3 shadow-sm rounded-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-300 " />
                <input v-model="newContraseñaData" type="password" placeholder="Repetir Contraseña"
                    class="text-gray-500 bg-gray-100 p-3 shadow-sm rounded-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-300" />
                <div class="space-y-2 flex flex-col">
                    <button type="submit"
                        class="p-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-800 w-full transition duration-300 cursor-pointer">
                        REGISTRARSE
                    </button>
                    <button @click="navigateTo('/login')"
                        class="p-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-800 w-full transition duration-300 cursor-pointer">
                        LOGIN
                    </button>
                </div>
                <p v-if="errorMsg" class="text-center text-red-500 font-semibold">{{ errorMsg }}</p>
            </form>
        </section>
    </main>
</template>