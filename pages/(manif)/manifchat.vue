<script setup>

const route = useRoute();
const manifId = ref(route.query.manifId);
const mensajes = ref([]);
const nuevoMensaje = ref('');
const usuario = ref(null);
const client = useSupabaseClient();
const channel = ref(null);
const manifNombre = ref('')

const obtenerMensajes = async () => {
    if (!manifId.value) return;

    const { data, error } = await client
        .from('manifchat')
        .select('id, created_at, texto, user_id, manif_id, users(nombre)')
        .eq('manif_id', manifId.value)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error al obtener mensajes iniciales:', error);
        return;
    }
    mensajes.value = data;
};

const obtenerNombreManif = async () => {
    if (!manifId.value) {
        manifNombre.value = 'Selecciona una manifestación';
        return;
    }

    const { data, error } = await client
        .from('manifestaciones') 
        .select('titulo')
        .eq('id', manifId.value)
        .single();

    if (error) {
        console.error('Error al obtener el nombre de la manifestación:', error);
        manifNombre.value = 'Error al cargar la manifestación';
        return;
    }

    if (data) {
        manifNombre.value = data.nombre;
    } else {
        manifNombre.value = 'Manifestación no encontrada';
    }

    manifNombre.value = data
};

const enviarMensaje = async () => {
    if (!nuevoMensaje.value.trim() || !usuario.value?.id || !manifId.value) return;

    const { error } = await client.from('manifchat').insert([
        { texto: nuevoMensaje.value, user_id: usuario.value.id, manif_id: manifId.value },
    ]);

    if (error) {
        console.error('Error al enviar mensaje:', error);
        return;
    }

    nuevoMensaje.value = '';
};

const eliminarMensaje = async (id) => {
    if (!usuario.value?.id || !manifId.value) return;

    const { error } = await client
        .from('manifchat')
        .delete()
        .eq('id', id)
        .eq('user_id', usuario.value?.id)
        .eq('manif_id', manifId.value);

    if (error) {
        console.error('Error al eliminar el mensaje:', error);
        return;
    }

    mensajes.value = mensajes.value.filter((mensaje) => mensaje.id !== id);
};

const mensajesRealTime = async (payload) => {
    await obtenerMensajes();
};

onMounted(async () => {
    const { data: { user } } = await client.auth.getUser();
    usuario.value = user;

    await obtenerNombreManif();
    await obtenerMensajes();
    

    if (manifId.value) {
        channel.value = client.channel(`pruebamanif`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'manifchat', }, mensajesRealTime)
            .subscribe();
    }
});

onUnmounted(() => {
    if (channel.value) {
        channel.value.unsubscribe();
    }
});


</script>

<template>
    <div class="h-full overflow-y-auto py-20 px-2 flex flex-col" v-if="manifId">
        <h2 class="text-3xl font-extrabold text-blue-900 text-center " >{{ manifNombre.titulo }}</h2>
        <div v-for="mensaje in mensajes" :key="mensaje.id"
            :class="mensaje.user_id === usuario?.id ? 'mensaje-usuario' : 'mensaje-otro'"
            class="mensaje p-2 rounded-lg mb-4 max-w-3/4 flex items-end justify-between">
            <div>
                <p class="text-xs text-gray-200 mb-2" v-if="mensaje.users">{{ mensaje.users.nombre }}</p>
                <p>{{ mensaje.texto }}</p>
            </div>
            <button v-if="mensaje.user_id === usuario?.id" @click="eliminarMensaje(mensaje.id)"
                class="ml-2 text-red-500 hover:text-red-700 text-sm focus:outline-none">
                <Icon name="material-symbols:delete-forever-rounded"></Icon>
            </button>
        </div>
    </div>
    <div v-else class="text-center py-6">
        <p class="text-gray-500">Selecciona una manifestación para ver el chat.</p>
    </div>

    <div class="flex p-5 fixed bottom-1 w-full ">
        <input v-model="nuevoMensaje" @click="enviarMensaje"
            class="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Escribe tu mensaje..." />
        <button
            class="bg-blue-900 hover:-translate-y-0.5 cursor-pointer text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline ml-2"
            @click="enviarMensaje">
            Enviar
        </button>
    </div>
</template>

<style scoped>
.mensaje-usuario {
    align-self: flex-end;
    background-color: #2e3268;
    color: #ffffff;
}

.mensaje-otro {
    align-self: flex-start;
    background-color: #9999ee;
    color: #ffffff;
}

.mensaje {
    word-break: break-word;
}
</style>