<script setup lang="ts">
import { RouterView } from 'vue-router'
const year = new Date().getFullYear()
</script>

<template>
  <div class="flex flex-col h-screen justify-between items-start">
    <header class="content-box mt-0 flex items-center justify-between w-full">
      <RouterLink to="/" class="block">Patchwork???</RouterLink>
      <RouterLink to="/getting-started" class="button">Get Started</RouterLink>
    </header>

    <main class="content-box mt-0 mb-auto">
      <RouterView />
    </main>

    <footer class="content-box mt-0 p-5">
      <p class="text-center">Copyright © {{ year }} Patchwork??? contributors.</p>
    </footer>
  </div>
</template>

<style scoped></style>
