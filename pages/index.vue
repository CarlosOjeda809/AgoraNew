<script setup>

const client = useSupabaseClient();
const router = useRouter();
const userName = ref('');
const errorMsg = ref('');
const user = useSupabaseUser();

const navigateTo = (path) => {
    router.push(path);
};

const logout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        const { error } = await client.auth.signOut();
        if (error) {
            errorMsg.value = error.message;
            console.error('Error al cerrar sesión: ', error);
        } else {
            userName.value = '';
            errorMsg.value = '';
            router.push('/login');
        }
    }
};
</script>

<template>
    <main class="min-h-screen flex flex-col bg-gray-100 overflow-hidden">
        <section class="flex-grow flex flex-col items-center">
            <div class="container mx-auto px-4 py-6 sm:py-8 z-10">
                <header>
                    <NuxtLink to="/" src="/img/logoagora.png"
                        class="mx-auto w-7/8 sm:w-1/2 md:w-1/3 cursor-pointer transition duration-500 hover:scale-103 z-10"
                        alt="Logo Agora" />
                </header>
                <nav class="mt-10 space-y-8 flex flex-col items-center justify-center">
                    <div v-if="(!user)">
                        <h1 class="text-2xl sm:text-3xl text-gray-800 font-bold text-center p-3 rounded-md shadow-sm bg-gray-900/20">
                            ¡Bienvenido a Ágora!
                        </h1>
                        <p class="text-lg text-gray-600 text-center mt-4">
                            Inicia sesión para acceder a todas las funcionalidades.
                        </p>
                    </div>
                    <NuxtLink to="/noticias"
                        class="relative w-full max-w-md hover:-translate-y-1 cursor-pointer rounded-xl transition shadow-md overflow-hidden duration-300 hover:shadow-lg">
                        <img src="/img/noticias.png" class="h-48 sm:h-64 w-full object-cover"
                            alt="Logo noticias" />
                        <div
                            class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/10 hover:bg-black/20 transition duration-500">
                            <h1 class="text-2xl sm:text-3xl text-white font-bold text-center p-3 rounded-md shadow-sm bg-gray-900/20">
                                NOTICIAS
                            </h1>
                        </div>
                    </NuxtLink>
                    <NuxtLink to="/forospage"
                        class="relative w-full max-w-md cursor-pointer hover:-translate-y-1 rounded-xl transition shadow-md overflow-hidden  duration-300 hover:shadow-lg">
                        <img src="/img/forosindex.png" class="h-48 sm:h-64 -translate-y-3 w-full object-cover" alt="Logo foros" />
                        <div
                            class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/10 hover:bg-black/20 transition duration-300">
                            <h1 class="text-2xl sm:text-3xl text-white font-bold text-center p-3 rounded-md shadow-sm bg-gray-900/20">
                                FOROS
                            </h1>
                        </div>
                    </NuxtLink>
                </nav>
            </div>
        </section>
    </main>
</template>