
export default defineNuxtRouteMiddleware(async (to, from) => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  if (user.value) {
    try {

      const { data: existingUser, error: checkError } = await client
        .from('users')
        .select('id')
        .eq('id', user.value.id)
        .single()


      if (!existingUser) {
        await client.from('users').insert({
          id: user.value.id,
          nombre: user.value.user_metadata?.full_name || user.value.user_metadata?.name || user.value.email?.split('@')[0] || 'Usuario',
          email: user.value.email
        })
      }
    } catch (error) {
      console.error('Error en oauthHandler: ', error)
    }
  }
})