<script setup>
import { NuxtLink } from '#components'


const config = useRuntimeConfig()
const noticias = ref([])
const isLoading = ref(true)
const errorMsg = ref(null)
const router = useRouter()

const guardianApiKey = config.public.guardianApiKey;
let guardianApiUrl = null;

if (!guardianApiKey) {
    console.error('Error: GUARDIAN_API_KEY no está definida en runtimeConfig.public.');
    errorMsg.value = 'La configuración de la API de noticias no está completa.';
    isLoading.value = false;
} else {

    guardianApiUrl = `https://content.guardianapis.com/search?show-fields=thumbnail,trailText&api-key=${guardianApiKey}`;
    console.log('Intentando obtener noticias desde The Guardian:', guardianApiUrl);
}

const { data: guardianData, pending, error: fetchError } = await useFetch(guardianApiUrl, {

    immediate: !!guardianApiUrl,

    watch: false
});

watch(pending, (newPending) => {

    if (errorMsg.value === null) {
        isLoading.value = newPending;
    }
});

watch(fetchError, (newError) => {
    if (newError) {
        console.error("Error al obtener noticias desde The Guardian:", newError);

        errorMsg.value = newError.data?.message || newError.message || 'No se pudieron cargar las noticias.';
        noticias.value = [];
        isLoading.value = false;
    } else {

    }
});

watch(guardianData, (newData) => {
    if (newData && newData.response && newData.response.status === 'ok') {

        noticias.value = newData.response.results.map(result => ({

            title: result.webTitle || 'Título no disponible',
            description: result.fields?.trailText || '',
            url: result.webUrl,
            urlToImage: result.fields?.thumbnail || null
        }));
        errorMsg.value = null;
    } else if (newData) {

        console.warn('Respuesta inesperada o no exitosa de The Guardian API:', newData);
        errorMsg.value = 'No se pudieron obtener noticias con el formato esperado.';
        noticias.value = [];
    }
    if (errorMsg.value === null) {
        isLoading.value = false;
    }
}, { immediate: true });

</script>

<template>
    <main class="bg-gray-100 min-h-screen flex flex-col items-center p-6 sm:p-8 lg:p-10 space-y-8 relative overflow-hidden">
        <header>
            <NuxtLink to="/" src="/img/logoagora.png" class="mx-auto w-4/4 sm:w-1/2 md:w-1/3 mt-8 cursor-pointer transition duration-500 hover:scale-103 z-10" alt="Logo Agora" />
            <h1 class="text-xl text-gray-700 sm:text-4xl font-serif font-bold text-center -mt-5 p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm z-10">
                NOTICIAS DE ACTUALIDAD
            </h1>
        </header>
        <section class="w-full max-w-xl space-y-4 sm:space-y-6 z-10">

            <p v-if="isLoading" class="text-center text-gray-500 py-4">Cargando noticias...</p>

            <p v-else-if="errorMsg" class="text-center text-red-600 bg-red-100 p-4 rounded-lg shadow-sm">{{ errorMsg }}</p>

            <template v-else-if="noticias.length > 0">
                <article v-for="(noticia, index) in noticias"
                    :key="noticia.id || index"
                    :href="noticia.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block bg-white rounded-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 overflow-hidden">

                    <div class="p-4">
                        <h2 class="text-lg sm:text-xl font-semibold mb-2 text-gray-800">{{ noticia.title }}</h2>
                        <p v-if="noticia.description" class="text-gray-600 text-sm sm:text-base leading-relaxed" v-html="noticia.description"></p>
                    </div>
                    <img v-if="noticia.urlToImage"
                        :src="noticia.urlToImage"
                        alt="Imagen de noticia"
                        class="w-full h-48 object-cover" />
                </article>
            </template>

            <p v-else class="text-center text-gray-500 py-4">No se encontraron noticias.</p>

            <div class="text-center text-xs text-gray-500 pt-4">
                Noticias de <a href="https://www.theguardian.com/" target="_blank" class="underline hover:text-gray-700">The Guardian</a>.
            </div>

        </section>
    </main>
</template>