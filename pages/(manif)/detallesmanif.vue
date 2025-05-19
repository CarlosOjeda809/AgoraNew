<script setup>
import { NuxtLink } from '#components';

const client = useSupabaseClient();
const route = useRoute();
const manifestacion = ref(null);
const isLoading = ref(true);
const errorMsg = ref('');
const manifestationId = route.query.id;

const fetchManifestationDetails = async () => {
    isLoading.value = true;
    errorMsg.value = '';

    if (!manifestationId) {
        console.error('No se proporcionó un ID de manifestación.');
        errorMsg.value = 'No se proporcionó un ID válido.';
        isLoading.value = false;
        return;
    }

    try {
        const { data, error } = await client
            .from('manifestaciones')
            .select('*')
            .eq('id', manifestationId)
            .single();

        if (error) {
            console.error(`Error al traer detalles de manifestación ${manifestationId}:`, error);
            errorMsg.value = 'Error al cargar los detalles.';
        } else {
            manifestacion.value = data;
        }

    } catch (err) {
        console.error(`Error al traer detalles de manifestación ${manifestationId}:`, err);
        errorMsg.value = 'Error al cargar los detalles.';
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchManifestationDetails();
});

const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch (e) {
        console.error("Error formateando fecha:", e);
        return "Fecha inválida";
    }
};
</script>

<template>
    <main class="bg-gray-100 py-10 min-h-screen flex flex-col items-center">
        <header class="mb-8">
            <NuxtLink to="/" src="/img/logoagora.png" alt="Logo Ágora" class="w-48 h-auto md:w-96 hover:scale-103 cursor-pointer transition duration-500" />
        </header>
        <section>
            <div v-if="isLoading" class="text-blue-900 text-lg font-semibold text-center">
                Cargando detalles...
            </div>
            <div v-else-if="errorMsg" class="text-red-500 text-center">
                {{ errorMsg }}
            </div>

            <article v-else-if="manifestacion" class="max-w-md md:max-w-2xl w-full px-4 md:px-8">
                <div class="mb-6 md:mb-8">
                    <img :src="manifestacion.imagen" :alt="manifestacion.titulo" class="w-full h-auto rounded-md" />
                </div>
                <h1 class="text-2xl md:text-4xl font-bold text-blue-900 mb-4 md:mb-6 text-center">{{ manifestacion.titulo }}</h1>
                <div class="mb-4 md:mb-6">
                    <strong class="text-blue-900 block mb-1 md:text-lg">Descripción:</strong>
                    <p class="text-gray-700 md:text-lg">{{ manifestacion.descripcion }}</p>
                </div>
                <div class="mb-4 md:mb-6">
                    <strong class="text-blue-900 block mb-1 md:text-lg">Fecha de Inicio:</strong>
                    <p class="text-gray-700 md:text-lg">{{ formatDate(manifestacion.fecha) }}</p>
                </div>
                <div class="mb-6 md:mb-8">
                    <strong class="text-blue-900 block mb-1 md:text-lg">Ubicación:</strong>
                    <p class="text-gray-700 md:text-lg">{{ manifestacion.ubicacion }}</p>
                </div>
                <footer class="border-t border-gray-200 pt-4 text-center">
                    <p class="text-sm text-gray-500 md:text-base">ID: {{ manifestacion.id }}</p>
                </footer>
            </article>
            <div v-else class="text-gray-500 text-center">
                No se encontraron detalles para esta manifestación.
            </div>
        </section>
    </main>
</template>