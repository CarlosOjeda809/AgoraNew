<script setup>
import { ref, onMounted } from 'vue';
import { useSupabaseClient, useSupabaseUser, navigateTo } from '#imports';

const forosExternos = ref([]);
const loading = ref(true);
const error = ref(null);
const client = useSupabaseClient();
const user = useSupabaseUser();

async function fetchForosExternos() {
    loading.value = true;
    error.value = null;

    try {
        const { data, error: fetchError } = await client
            .from('foros')
            .select('id, titulo, descripcion, user_id, user:user_id ( id, nombre )');

        if (fetchError) {
            console.error('Error fetching foros:', fetchError);
            error.value = 'Error al cargar los foros.';
        } else {
            forosExternos.value = data.map(foro => ({
                ...foro,
                user: foro.user || { nombre: 'Anónimo' }
            }));
        }
    } catch (err) {
        console.error('Unexpected error fetching foros:', err);
        error.value = 'Ocurrió un error inesperado.';
    } finally {
        loading.value = false;
    }
}

function isMyForo(foro) {
    return user.value && foro.user_id === user.value.id;
}

function goToChat(foroId) {
    navigateTo({ path: '/foroschat', query: { foroId: foroId } });
}

onMounted(() => {
    fetchForosExternos();
});
</script>

<template>
    <main class="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <header class="mb-8 text-center">
                <img @click="navigateTo('/')" src="/img/logoagora.png"
                    class="mx-auto w-2/4 sm:w-2/5 md:w-3/6 cursor-pointer transition duration-500 hover:scale-103 z-10"
                    alt="Logo Agora" />
                <h2 class="mt-4 text-3xl font-extrabold text-gray-600 tracking-tight sm:text-4xl">
                    Explora los Foros de la Comunidad
                </h2>
                <p class="mt-2 text-lg text-gray-400">
                    Descubre temas interesantes y participa en las conversaciones.
                </p>
            </header>

            <section v-if="loading" class="text-center text-gray-400 py-6">
                <svg class="animate-spin h-8 w-8 text-blue-700 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </section>
            <section v-else-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-md">
                {{ error }}
            </section>

            <section v-else class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <article v-for="foro in forosExternos" :key="foro.id"
                    class="bg-white rounded-lg shadow-lg hover:-translate-y-1 overflow-hidden hover:shadow-xl transition duration-300 relative flex flex-col cursor-pointer"
                    @click="goToChat(foro.id)">
                    <div class="p-6 bg-gray-200 grow">
                        <h3 class="text-xl font-semibold text-gray-900 mb-3 text-center min-h-[2.5em] flex items-center justify-center">
                            {{ foro.titulo }}
                        </h3>
                        <p class="text-gray-700 text-sm mb-4 line-clamp-4">
                            {{ foro.descripcion }}
                        </p>
                    </div>

                    <footer class="bg-gray-50 px-6 py-3 flex justify-between items-center text-xs font-medium border-t border-gray-200">
                        <span class="text-gray-500 truncate pr-2">
                            Creado por:
                            <span class="font-semibold text-gray-700">{{ foro.user?.nombre ?? 'Anónimo' }}</span>
                        </span>
                        <span v-if="isMyForo(foro)" class="text-green-600 text-sm font-bold flex items-center flex-shrink-0">
                            <Icon name="material-symbols:person" class="inline align-text-bottom mr-1" />
                            Mi foro
                        </span>
                    </footer>
                </article>
            </section>
        </div>
    </main>
</template>

<style>
@supports (-webkit-line-clamp: 4) {
    .line-clamp-4 {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;

    }
}
</style>