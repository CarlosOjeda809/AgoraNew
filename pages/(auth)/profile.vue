<script setup>

const client = useSupabaseClient();
const user = useSupabaseUser();


const userProfile = ref(null);
const userEmail = ref('');
const userForos = ref([]);
const userManifestaciones = ref([]);
const isLoading = ref(true);
const errorMsg = ref('');

const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
        const date = new Date(dateString);
        if (isNaN(date)) return 'Fecha inválida';
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return 'Fecha inválida';
    }
};

const fetchProfileData = async () => {
    isLoading.value = true;
    errorMsg.value = '';

    if (!user.value) {
        errorMsg.value = 'Usuario no autenticado.';
        isLoading.value = false;
        return;
    }

    userEmail.value = user.value.email || 'Email no disponible';

    try {
        const [profileResult, forosResult, manifResult] = await Promise.all([
            client.from('users').select('nombre').eq('id', user.value.id).maybeSingle(),
            client.from('foros').select('id, titulo, descripcion').eq('user_id', user.value.id),
            client.from('manifestaciones').select('id, titulo, fecha, ubicacion').eq('user_id', user.value.id).order('fecha', { ascending: false })
        ]);

        if (profileResult.error) throw new Error(`Error al obtener perfil: ${profileResult.error.message}`);
        userProfile.value = profileResult.data;

        if (forosResult.error) throw new Error(`Error al obtener foros: ${forosResult.error.message}`);
        userForos.value = forosResult.data || [];

        if (manifResult.error) throw new Error(`Error al obtener manifestaciones: ${manifResult.error.message}`);
        userManifestaciones.value = manifResult.data || [];

    } catch (err) {
        console.error('Error fetching profile data:', err);
        errorMsg.value = `Error al cargar los datos del perfil: ${err.message}`;
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchProfileData();
});

</script>

<template>
    <main class="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <header class="max-w-4xl mx-auto text-center">
            <NuxtLink to="/" src="/img/logoagora.png"
                class="mx-auto w-2/3 sm:w-1/3 md:w-1/4 cursor-pointer transition-shadow duration-300 hover:rounded-md hover:shadow-lg z-10"
                alt="Logo Agora" />
            <h1 class="text-4xl font-bold text-gray-900 mt-5">Mi Perfil</h1>
            <p class="text-lg text-gray-500 mt-1">Tu información personal y contenido creado.</p>
        </header>

        <section class="max-w-4xl mx-auto mt-8">
            <div v-if="isLoading" class="text-center py-20">
                <svg class="animate-spin h-10 w-10 text-blue-900 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <p class="mt-3 text-gray-500">Cargando tu perfil...</p>
            </div>

            <div v-else-if="errorMsg"
                class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center">
                {{ errorMsg }}
            </div>

            <div v-else class="space-y-8">
                <article class="bg-white rounded-xl shadow-lg p-6 md:p-8 border-t-4 border-blue-900">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
                        <Icon name="material-symbols:person-outline-rounded" class="w-7 h-7 mr-2 text-blue-900" />
                        Información Personal
                    </h2>
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <span class="font-medium text-gray-600 w-24">Nombre:</span>
                            <span class="text-gray-800 font-semibold text-lg">{{ userProfile?.nombre || 'No especificado' }}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="font-medium text-gray-600 w-24">Email:</span>
                            <span class="text-gray-700">{{ userEmail }}</span>
                        </div>
                    </div>
                </article>

                <article class="bg-white rounded-xl shadow-lg p-6 md:p-8 border-t-4 border-blue-900">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
                        <Icon name="material-symbols:forum-outline-rounded" class="w-7 h-7 mr-2 text-blue-900" />
                        Mis Foros Creados
                    </h2>
                    <div v-if="userForos.length > 0" class="space-y-4">
                        <div v-for="foro in userForos" :key="foro.id"
                            class="bg-blue-50/50 p-4 rounded-lg border border-blue-100 hover:shadow-sm transition duration-200">
                            <h3 class="text-lg font-medium text-blue-900 mb-1">{{ foro.titulo }}</h3>
                            <p class="text-sm text-gray-800">
                                {{ foro.descripcion }}
                            </p>
                        </div>
                    </div>
                    <div v-else class="text-center text-gray-800 py-4">
                        <p>Aún no has creado ningún foro.</p>
                    </div>
                </article>

                <article class="bg-white rounded-xl shadow-lg p-6 md:p-8 border-t-4 border-blue-900">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
                        <Icon name="material-symbols:campaign-outline-rounded" class="w-7 h-7 mr-2 text-blue-900" />
                        Mis Manifestaciones Creadas
                    </h2>
                    <div v-if="userManifestaciones.length > 0" class="space-y-4">
                        <div v-for="manif in userManifestaciones" :key="manif.id"
                            class="bg-blue-50/50 p-4 rounded-lg border border-blue-100 hover:shadow-sm transition duration-200">
                            <h3 class="text-lg font-medium text-blue-900 mb-1">{{ manif.titulo }}</h3>
                            <p v-if="manif.ubicacion" class="text-sm text-gray-600">
                                📍 {{ manif.ubicacion }}
                            </p>
                        </div>
                    </div>
                    <div v-else class="text-center text-gray-800 py-4">
                        <p>Aún no has creado ninguna manifestación.</p>
                    </div>
                </article>
            </div>
        </section>
    </main>
</template>