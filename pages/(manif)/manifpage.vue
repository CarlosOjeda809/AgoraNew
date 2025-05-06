<script setup>
const client = useSupabaseClient();
const user = useSupabaseUser();
const manifestaciones = ref([]);
const isLoading = ref(true);
const errorMsg = ref('');
const deletingId = ref(null);

const getManifestaciones = async () => {
    isLoading.value = true;
    errorMsg.value = '';
    try {
        const { data, error } = await client
            .from('manifestaciones')
            .select('id, titulo, descripcion, fecha, imagen, user_id, ubicacion, user:user_id (id, nombre)')
            .order('fecha', { ascending: false });

        if (error) {
            throw error;
        }

        manifestaciones.value = data.map(manifestacion => ({
            ...manifestacion,
            user: manifestacion.user || { nombre: 'Anónimo' }
        }));
    } catch (err) {
        console.error('Error al traer manifestaciones:', err);
        errorMsg.value = 'No se pudieron cargar las manifestaciones.';
    } finally {
        isLoading.value = false;
    }
};  

function isMyManifestation(manifestation) {
    return user.value && manifestation.user_id === user.value.id;
}

async function deleteManifestation(id) {
    deletingId.value = id;
    errorMsg.value = '';
    try {
        const { error } = await client
            .from('manifestaciones')
            .delete()
            .match({ id: id });

        if (error) throw error;

        manifestaciones.value = manifestaciones.value.filter(m => m.id !== id);
        console.log('Manifestación eliminada con éxito');

    } catch (err) {
        console.error('Error al eliminar manifestación:', err);
        errorMsg.value = 'Error al eliminar la manifestación. Inténtalo de nuevo.';
    } finally {
        deletingId.value = null;
    }
}

function confirmDelete(id) {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta manifestación? Esta acción no se puede deshacer.')) {
        deleteManifestation(id);
    }
}

onMounted(() => {
    getManifestaciones();
});


const goToDetails = (id) => {
    navigateTo({
        path: '/detallesmanif',
        query: { id: id }
    });
};

function goToChat(manifId) {
    navigateTo({ path: '/manifchat', query: { manifId: manifId } }); 
}


</script>

<template>
    <div class="bg-gray-200 min-h-screen p-5 relative">
        <div class="flex flex-col  items-center pt-6 sm:pt-10">
            <div class="mb-10">
                <img @click="navigateTo('/')" src="/img/logoagora.png"
                    class="mx-auto w-4/4 sm:w-1/2 md:w-1/3 cursor-pointer transition-shadow duration-300 hover:shadow-lg"
                    alt="Logo Agora" />
            </div>
            <h1 class="text-3xl font-bold text-gray-800 mb-8">Próximas Manifestaciones</h1>
            <button v-if="user" @click="navigateTo('/crearmanif')"
                class="bg-blue-900 text-white font-bold py-2 px-4 rounded-lg mb-7 shadow-md -mt-2 cursor-pointer hover:bg-gray-900 transition-colors duration-200 flex items-center space-x-2">
                <Icon name="material-symbols:add-circle-outline-rounded" class="text-xl block" /> <span>Crear
                    Manifestación</span>
            </button>

            <div v-if="isLoading" class="text-center text-gray-600 mt-10">
                <p>Cargando manifestaciones...</p>
                <svg class="animate-spin h-8 w-8 text-blue-700 mx-auto mt-4" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
            </div>

            <div v-else-if="errorMsg" class="text-center text-red-500 bg-red-100 p-3 rounded-md mt-4 max-w-md mx-auto">
                <p>{{ errorMsg }}</p>
            </div>

            <div v-else-if="manifestaciones.length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">

                <div v-for="manif in manifestaciones" :key="manif.id"
                    class="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-101 transition-transform duration-300 ease-in-out flex flex-col relative group"
                    :class="{ 'opacity-50 pointer-events-none': deletingId === manif.id }">

                    <button v-if="isMyManifestation(manif)" @click.stop="confirmDelete(manif.id)"
                        :disabled="deletingId === manif.id"
                        class="absolute top-3 right-3 z-10 bg-red-600 cursor-pointer hover:-translate-y-0.5 hover:bg-red-800 text-white p-2 rounded-full shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-white"
                        aria-label="Eliminar manifestación">
                        <svg v-if="deletingId === manif.id" class="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <Icon v-else name="material-symbols:delete" class="w-5 h-5 block" />
                    </button>
                    <button @click="goToChat(manif.id)"
                       
                        class="absolute top-3 left-3 z-10 bg-green-600 cursor-pointer hover:-translate-y-0.5 hover:bg-green-800 text-white p-2 rounded-full shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-100 focus:ring-offset-1 focus:ring-offset-white"
                        aria-label="Entrar en el chat">
                        <Icon name="material-symbols:chat" class="w-5 h-5 block" />
                    </button>

                    <div @click="goToDetails(manif.id)" class="cursor-pointer flex flex-col flex-1">
                        <img :src="manif.imagen || '/img/placeholder-image.png'"
                            @error="(e) => e.target.src = '/img/placeholder-image.png'" class="w-full h-56 object-cover"
                            alt="Imagen de la manifestación" />
                        <div class="p-6 flex flex-col flex-1">
                            <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ manif.titulo }}</h2>
                            <p class="text-gray-600 text-base mb-4">{{ manif.descripcion }}</p>
                            <p v-if="manif.ubicacion" class=" text-sm mb-4 text-cyan-700 font-semibold">📍 {{
                                manif.ubicacion }}</p>
                            <div class="mt-auto">
                                <div class="text-md text-gray-500 mb-2">
                                    📅 {{ manif.fecha ? new Date(manif.fecha).toLocaleDateString('es-ES', {
                                        year:
                                            'numeric', month: 'long', day: 'numeric' }) : 'Fecha no especificada' }}
                                </div>
                                <div
                                    class="flex justify-between items-center text-xs font-medium pt-2 border-t border-gray-200">
                                    <span class="text-gray-500 truncate pr-2">
                                        Creado por:
                                        <span class="font-semibold text-gray-700">{{ manif.user?.nombre ?? 'Anónimo'
                                            }}</span>
                                    </span>
                                    <span v-if="isMyManifestation(manif)"
                                        class="text-green-600 text-sm font-bold flex items-center flex-shrink-0 bg-green-100 px-2 py-0.5 rounded-md">
                                        <Icon name="material-symbols:check-circle-outline-rounded"
                                            class="inline-block align-text-bottom mr-1 w-4 h-4" /> Mi Manifestación
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center text-gray-600 mt-10">
                <p>No hay manifestaciones programadas por el momento.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Quitado el estilo para line-clamp ya que no se usa */
</style>