export function useAuth() {

    const client = useSupabaseClient();
    const errorMsg = ref('');
    const users = ref([]);

    const signup = async (nombre, email, contraseña, repetirContraseña) => {
        if (!nombre?.trim() || !email?.trim() || !contraseña?.trim() || !repetirContraseña?.trim()) {
            errorMsg.value = 'Rellena todos los campos';
            return false;
        }

        if (contraseña !== repetirContraseña) {
            errorMsg.value = 'Las contraseñas no coinciden';
            return false;
        }

        const { data, error: authError } = await client.auth.signUp({
            email: email,
            password: contraseña,
        });

        if (authError) {
            console.error('Error al registrarse en Supabase', authError);
            errorMsg.value = authError.message;
            return false;
        }

        const userId = data.user?.id;

        if (!userId) {
            errorMsg.value = 'No se ha podido obtener el ID del usuario';
            return false;
        }

        const { error: insertError } = await client.from('users').insert([
            {
                id: userId,
                nombre: nombre,
                email: email,
            },
        ]);

        if (insertError) {
            console.error(insertError);
            errorMsg.value = insertError.message;
            return false;
        }

        errorMsg.value = 'Te has registrado con éxito. Revisa tu correo para verificar tu cuenta.';
        return true;

        nombre.value = ''
        email.value = ''
        contraseña.value = ''
        repetirContraseña.value = ''
    };


    const mostrarDatos = async () => {
        const { data, error } = await client.from('users').select()
        users.value = data
    };

    return {
        signup,
        mostrarDatos,
        errorMsg,
        users
    }
}