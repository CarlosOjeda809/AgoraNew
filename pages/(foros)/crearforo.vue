<script setup>
import { NuxtLink } from '#components';

const client = useSupabaseClient();
const router = useRouter();
const foros = ref([]);
const titulo = ref('');
const descripcion = ref('');
const errorMsg = ref('');

const crearForo = async () => {
    if (!titulo.value || !descripcion.value) {
        errorMsg.value = 'Rellena todos los campos';
        return false;
    }

    const { data: { session } } = await client.auth.getSession();

    if (session?.user?.id) {
        const userId = session.user.id;

        const { data, error } = await client.from('foros').insert([
            { titulo: titulo.value, descripcion: descripcion.value, user_id: userId }
        ]);

        if (error) {
            console.error('Error al crear el foro:', error);
            errorMsg.value = error.message;
            return false;
        }

        errorMsg.value = '';
        router.push('/misforos');
    } else {
        console.error('Usuario no autenticado, no se puede crear el foro.');
        errorMsg.value = 'Debes estar autenticado para crear un foro.';
        return false;
    }
};

const goBack = () => {
    router.go(-1);
};
</script>

<template>
    <main class="bg-gray-200 min-h-screen flex justify-center">
        <article class="w-full max-w-4xl p-6 sm:p-10 md:p-16 lg:p-20 xl:p-32">
            <header>
                <NuxtLink to="/" src="/img/logoagora.png"
                    class="mx-auto w-7/8 cursor-pointer transition duration-500 hover:scale-103 z-10"
                    alt="Logo Agora" />
            </header>
            <section class="flex flex-col items-center mt-8">
                <div class="w-full max-w-2xl space-y-8 rounded-lg">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Crear un nuevo foro
                        </h2>
                    </div>
                    <form @submit.prevent="crearForo" class="mt-8 space-y-6">
                        <input type="hidden" name="remember" value="true">
                        <div class="rounded-md -space-y-px">
                            <label for="titulo" class="sr-only">Título del foro</label>
                            <input v-model="titulo" id="titulo" name="titulo" type="text" required
                                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm "
                                placeholder="Título del foro">
                            <label for="descripcion" class="sr-only">Descripción del foro</label>
                            <textarea v-model="descripcion" id="descripcion" name="descripcion" rows="4" required
                                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Descripción del foro"></textarea>
                        </div>

                        <div class="space-y-2">
                            <button type="submit"
                                class="group relative w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                </span>
                                Crear Foro
                            </button>
                            <button type="button" @click="router.push('/misforos')"
                                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-gray-100 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                </span>
                                Cancelar
                            </button>
                        </div>
                        <p v-if="errorMsg" class="text-red-500">{{ errorMsg }}</p>
                    </form>
                </div>
            </section>
        </article>
    </main>
</template>