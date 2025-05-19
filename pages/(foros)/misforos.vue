<script setup>
import { NuxtLink } from '#components';

const client = useSupabaseClient();
const user = useSupabaseUser();
const foros = ref([]);
const router = useRouter();
const loading = ref(true);
const error = ref(null);

const recibirForos = async () => {
    loading.value = true;
    error.value = null;

    try {

        if (!user.value || !user.value.id) {
            console.error('No hay usuario autenticado');
            error.value = 'Debes iniciar sesión para ver tus foros';
            foros.value = [];
            return;
        }

        const { data, error: fetchError } = await client
            .from('foros')
            .select('*')
            .eq('user_id', user.value.id);

        if (fetchError) {
            console.error('Error al obtener los foros:', fetchError);
            error.value = 'Error al cargar tus foros';
            return;
        }

        foros.value = data || [];
        console.log(`Se encontraron ${foros.value.length} foros para el usuario ${user.value.id}`);
    } catch (err) {
        console.error('Error inesperado al obtener los foros:', err);
        error.value = 'Ocurrió un error inesperado';
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await recibirForos();
});

const deleteForo = async (foroId) => {
    if (window.confirm('¿Estás seguro?')) {
        try {

            const { data: foroData } = await client
                .from('foros')
                .select('user_id')
                .eq('id', foroId)
                .single();

            if (!foroData || foroData.user_id !== user.value.id) {
                console.error('No tienes permiso para eliminar este foro');
                return;
            }

            const { error: deleteError } = await client
                .from('foros')
                .delete()
                .eq('id', foroId);

            if (deleteError) {
                console.error('Error al eliminar el foro:', deleteError);
            } else {
                console.log('Foro eliminado con éxito');
                await recibirForos();
            }
        } catch (err) {
            console.error('Error inesperado al eliminar el foro:', err);
        }
    }
};
</script>

<template>
    <main class="bg-gray-200 min-h-screen p-8 mt-16">
        <header class="mb-4 border-b-2 pb-2 text-black flex justify-between items-center">
            <NuxtLink to="/" src="/img/logoagora.png"
                class="w-7/8 sm:w-1/2 md:w-1/3 cursor-pointer transition duration-500 mt-5 mx-auto hover:scale-103 z-10"
                alt="Logo Agora" />
            <h2 class="text-xl font-semibold text-black">MIS FOROS</h2>
            <NuxtLink to="/crearforo"
                class="flex items-center hover:bg-gray-300/80 hover:-translate-y-0.5 cursor-pointer bg-gray-300/50 rounded-md shadow-md p-2">
                <Icon name="material-symbols:add-circle-outline" class="text-2xl text-black"></Icon>
                <p class="font-bold ml-1 text-black">CREAR</p>
            </NuxtLink>
        </header>
        <section>
            <div v-if="loading" class="text-center py-8">
                <Icon name="mingcute:loading-fill" class="text-blue-700 text-4xl animate-spin"></Icon>
                <p class="mt-2 text-gray-600">Cargando tus foros...</p>
            </div>
            <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
                <span class="block sm:inline">{{ error }}</span>
            </div>
            <div v-else-if="foros.length === 0" class="text-center py-8">
                <Icon name="material-symbols:forum-outline" class="text-gray-400 text-6xl"></Icon>
                <p class="mt-2 text-gray-600">No has creado ningún foro todavía</p>
                <NuxtLink to="/crearforo"
                    class="mt-4 bg-blue-600 hover:bg-blue-800 cursor-pointer transition-colors text-white font-bold py-2 px-4 rounded">
                    Crear mi primer foro
                </NuxtLink>
            </div>
            <div v-else class="space-y-4 bg-gray-200">
                <article v-for="foro in foros" :key="foro.id"
                    class="bg-gray-100 hover:-translate-y-0.5 rounded-md shadow-md p-4 hover:shadow-lg transition duration-300">
                    <div class="flex flex-wrap justify-between">
                        <h3 class="font-bold text-black text-lg">{{ foro.titulo }}</h3>
                        <Icon @click="deleteForo(foro.id)" name="material-symbols-light:delete-rounded"
                            class="text-red-500 hover:text-red-700 cursor-pointer hover:-translate-y-0.5 text-2xl"
                            title="Eliminar foro"></Icon>
                    </div>
                    <p class="text-sm text-gray-600 mt-2">{{ foro.descripcion }}</p>
                    <div class="flex justify-between items-center mt-3">
                    </div>
                </article>
            </div>
        </section>
    </main>
</template>