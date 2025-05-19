<script setup>
import { NuxtLink } from '#components';


</script>

<template>
    <main class="bg-gray-100 min-h-screen p-4">
        <button @click="goBack"
            class="fixed top-4 left-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-200">
            <Icon class="align-middle text-3xl font-bold" name="material-symbols-light:arrow-back"></Icon>
        </button>

        <div class="max-w-lg mx-auto overflow-hidden">
            <header>
                <NuxtLink to="/" src="/img/logoagora.png"
                    class="mx-auto w-8/8 sm:w-5/5 md:w-3/3 cursor-pointer transition duration-500 hover:scale-103 g z-10"
                    alt="Logo Agora" />
            </header>

            <section class="grid gap-6 space-y-4 p-8 mt-6">
                <article
                    class="rounded-md shadow-sm overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition duration-300">
                    <NuxtLink to="/foroscards" class="relative">
                        <img src="/img/forosexternos.jpg"
                            alt="Foros Externos" class="w-full h-56 object-cover object-center" />
                        <div class="absolute inset-0 bg-gray-500/30 flex items-center justify-center">
                            <h2 class="text-xl font-bold text-white">FOROS EXTERNOS</h2>
                        </div>
                    </NuxtLink>
                    <div class="p-2 bg-gray-50 text-gray-700 text-sm font-semibold">
                        Foros donde se promueve el debate y la discusión sobre temas sociales, políticos y culturales.
                    </div>
                </article>

                <article
                    class="rounded-md shadow-sm overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition duration-300">
                    <NuxtLink to="/manifpage" class="relative">
                        <img src="/img/manifestacionesexternas.jpg"
                            alt="Manifestaciones" class="w-full h-56 object-cover object-center" />
                        <div class="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
                            <h2 class="text-xl font-bold text-white">MANIFESTACIONES</h2>
                        </div>
                    </NuxtLink>
                    <div class="p-2 bg-gray-50 text-gray-700 text-sm font-semibold">
                        Espacio para coordinar, informar y debatir sobre diversas manifestaciones, huelgas y/o protestas.
                    </div>
                </article>
            </section>
        </div>
    </main>
</template>