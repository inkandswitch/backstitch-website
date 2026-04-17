<script setup lang="ts">
import { RouterView } from 'vue-router'
import BackgroundSpiral from './components/BackgroundSpiral.vue'
import BackstitchIcon from './components/icons/BackstitchIcon.vue'
const year = new Date().getFullYear()
</script>

<template>
  <div class="relative main-container">
    <div class="overflow-hidden absolute top-0 left-0 bottom-0 right-0 hidden sm:block opacity-50">
      <BackgroundSpiral class="absolute top-0 -left-1/8 w-1/4 xl:-left-1/6 lg:w-1/3" />
      <BackgroundSpiral class="absolute top-0 -right-1/8 w-1/4 xl:-right-1/6 xl:w-1/3 rotate-180" />
    </div>
    <div class="flex flex-col min-h-screen justify-between items-start relative w-full">
      <header class="content-box my-8 flex items-center justify-between w-full">
        <RouterLink to="/" class="home-link flex items-center gap-3 bg-mauve-900 rounded-2xl">
          <BackstitchIcon class="fill-neutral-300 stroke-neutral-300 h-18" />
          <div class="font-serif text-3xl font-regular mb-2">Backstitch</div>
        </RouterLink>
        <RouterLink to="/docs" class="button" v-if="!$route.fullPath.startsWith('/docs')"
          >Get Started</RouterLink
        >
      </header>

      <main class="relative mt-0 grow w-full flex flex-col">
        <RouterView />
      </main>

      <footer class="bg-[rgba(0,0,0,0.2)] w-full mt-4 p-5">
        <div class="content-box">
          <p class="text-center">
            Contact: <a href="mailto:paul@inkandswitch.com">paul@inkandswitch.com</a>
          </p>
          <p class="text-center">Copyright © {{ year }} Backstitch contributors.</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.home-link:hover * {
  color: white;
  fill: white;
}
</style>
