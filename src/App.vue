<script setup lang="ts">
import { RouterView } from 'vue-router'
import BackgroundSpiral from './components/BackgroundSpiral.vue'
const year = new Date().getFullYear()
</script>

<template>
  <div class="relative">
    <div class="overflow-hidden absolute top-0 left-0 bottom-0 right-0 hidden sm:block opacity-50">
      <BackgroundSpiral class="absolute top-0 -left-1/8 w-1/4 xl:-left-1/6 lg:w-1/3" />
      <BackgroundSpiral class="absolute top-0 -right-1/8 w-1/4 xl:-right-1/6 xl:w-1/3 rotate-180" />
    </div>
    <div class="flex flex-col min-h-screen justify-between items-start relative">
      <header class="content-box my-8 flex items-center justify-between w-full">
        <RouterLink to="/" class="block">Backstitch</RouterLink>
        <RouterLink to="/getting-started" class="button">Get Started</RouterLink>
      </header>

      <main class="content-box mt-0 mb-auto">
        <RouterView />
      </main>

      <footer class="content-box mt-0 p-5">
        <p class="text-center">Copyright © {{ year }} Backstitch contributors.</p>
      </footer>
    </div>
  </div>
</template>

<style scoped></style>
