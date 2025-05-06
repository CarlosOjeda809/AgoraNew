<script setup>
import { ref } from 'vue';

const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const titulo = ref('');
const descripcion = ref('');
const fecha = ref('');
const ubicacion = ref('')
const imagen = ref('');
const isLoading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const crearManifestacion = async () => {

    if (!titulo.value || !descripcion.value || !fecha.value) {
        errorMsg.value = 'Por favor completa todos los campos obligatorios.';
        return;
    }

    if (!user.value) {
        errorMsg.value = 'Debes iniciar sesión para crear una manifestación.';
        return;
    }

    isLoading.value = true;
    errorMsg.value = '';

    try {

        const { data, error } = await client
            .from('manifestaciones')
            .insert([
                {
                    titulo: titulo.value,
                    descripcion: descripcion.value,
                    fecha: fecha.value,
                    ubicacion: ubicacion.value,
                    imagen: imagen.value || 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png',
                    user_id: user.value.id
                }
            ]);

        if (error) throw error;

        successMsg.value = '¡Manifestación creada con éxito!';

        titulo.value = '';
        descripcion.value = '';
        fecha.value = '';
        ubicacion.value = '';
        imagen.value = '';

        setTimeout(() => {
            router.push('/manifpage');
        }, 2000);

    } catch (err) {
        console.error('Error al crear la manifestación:', err);
        errorMsg.value = 'Ocurrió un error al crear la manifestación. Por favor, inténtalo de nuevo.';
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="bg-gray-200 min-h-screen p-5">
        <div class="flex flex-col items-center pt-6 sm:pt-10">
            <div class="mb-10 ">
                <img src="/img/logoagora.png"
                    class="mx-auto w-4/4 sm:w-1/2 md:w-1/3 transition-shadow duration-300 hover:shadow-lg"
                    alt="Logo Agora" />
            </div>

            <h1 class="text-3xl font-bold text-gray-800 mb-8">Crear Nueva Manifestación</h1>

            <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

                <div v-if="errorMsg" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {{ errorMsg }}
                </div>

                <div v-if="successMsg" class="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                    {{ successMsg }}
                </div>

                <form @submit.prevent="crearManifestacion" class="space-y-4">
                    <div>
                        <label for="titulo" class="block text-gray-700 font-semibold mb-2">Título</label>
                        <input id="titulo" v-model="titulo" type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Título de la manifestación" required />
                    </div>

                    <div>
                        <label for="descripcion" class="block text-gray-700 font-semibold mb-2">Descripción</label>
                        <textarea id="descripcion" v-model="descripcion" rows="4"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe la manifestación" required></textarea>
                    </div>

                    <div>
                        <label for="fecha" class="block text-gray-700 font-semibold mb-2">Fecha</label>
                        <input id="fecha" v-model="fecha" type="date"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required />
                    </div>

                    <div>
                        <label for="ubicacion" class="block text-gray-700 font-semibold mb-2">Ubicacion</label>
                        <input id="fecha" v-model="ubicacion" type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ubicación" required />
                    </div>

                    <div>
                        <label for="imagen" class="block text-gray-700 font-semibold mb-2">URL de Imagen
                            (opcional)</label>
                        <input id="imagen" v-model="imagen" type="url"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://ejemplo.com/imagen.jpg" />
                    </div>

                    <div class="flex justify-between pt-4">
                        <button type="button" @click="$router.push('/')"
                            class="px-4 py-2 bg-gray-500 text-white  cursor-pointer hover:-translate-y-0.5 rounded-md hover:bg-gray-600 transition">
                            Cancelar
                        </button>

                        <button type="submit" :disabled="isLoading"
                            class="px-4 py-2 bg-blue-900 cursor-pointer hover:-translate-y-0.5 text-white rounded-md hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="isLoading">Creando...</span>
                            <span v-else>Crear Manifestación</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>