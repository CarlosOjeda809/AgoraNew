<script setup>
import { NuxtLink } from '#components';


const router = useRouter()

const goBack = () => {
    router.go(-1);
};

</script>

<template>
    <div class="bg-gray-200 h-screen p-5">

        <NuxtLink to="/" src="/img/logoagora.png "
            class="mx-auto w-7/8 mt-5 sm:w-1/2 md:w-1/3 cursor-pointer transition duration-500 hover:scale-103 z-10"
            alt="Logo Agora" />
        <div class="mt-10  space-y-8">
            <NuxtLink to="/forosexternos" class="bg-[#171e57] hover:bg-[#060636]
             w-full rounded-lg shadow-md cursor-pointer transition duration-300 hover:-translate-y-0.5 p-5 mt-5 flex  flex-col items-center justify-center 
            font-serif text-center font-bold text-4xl sm:text-3xl text-white">
                FOROS EXT. MANIFEST. Y HUELGAS
            </NuxtLink>

            <NuxtLink to="/misforos"
                class=" w-full rounded-lg cursor-pointer bg-[#171e57] hover:bg-[#060636] transition duration-300 hover:-translate-y-0.5 shadow-md p-5 mt-5 flex flex-col items-center justify-center font-serif text-center font-bold text-4xl sm:text-3xl text-white">
                MIS <p class="flex mt-2">FOROS</p>
            </NuxtLink>
            <div
                class=" w-full rounded-lg shadow-lg border border-gray-500 p-5 mt-5 flex flex-col items-center justify-center font-serif text-center font-bold text-4xl sm:text-3xl text-white">
                <img src="/img/comingsoon.png" class="w-[170px] h-[170px]">
                </img>
            </div>
        </div>
    </div>
</template>