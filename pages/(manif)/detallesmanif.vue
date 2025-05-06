<script setup>
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
    <div class="bg-gray-100 py-10 min-h-screen flex flex-col items-center  ">

        <div class="mb-8">
            <img src="/img/logoagora.png" alt="Logo Ágora" class="w-90 h-auto" />
        </div>
        <div v-if="isLoading" class="text-blue-900 text-lg font-semibold text-center">
            Cargando detalles...
        </div>
        <div v-else-if="errorMsg" class="text-red-500 text-center">
            {{ errorMsg }}
        </div>

        <div v-else-if="manifestacion" class="max-w-md w-full px-4">
            <div class="mb-4">
                <img :src="manifestacion.imagen" :alt="manifestacion.titulo" class="w-full h-auto rounded-md" />
            </div>
            <h1 class="text-3xl font-bold text-blue-900 mb-6 text-center">{{ manifestacion.titulo }}</h1>
            <div class="mb-4">
                <strong class="text-blue-900 block mb-1">Descripción:</strong>
                <p class="text-gray-700">{{ manifestacion.descripcion }}</p>
            </div>
            <div class="mb-4">
                <strong class="text-blue-900 block mb-1">Fecha de Inicio:</strong>
                <p class="text-gray-700">{{ formatDate(manifestacion.fecha) }}</p>
            </div>
            <div class="mb-4">
                <strong class="text-blue-900 block mb-1">Ubicación:</strong>
                <p class="text-gray-700">{{ manifestacion.ubicacion }}</p>
            </div>
            <div class="border-t border-gray-200 pt-4 text-center">
                <p class="text-sm text-gray-500">ID: {{ manifestacion.id }}</p>
            </div>
        </div>
        <div v-else class="text-gray-500 text-center">
            No se encontraron detalles para esta manifestación.
        </div>
    </div>
</template>