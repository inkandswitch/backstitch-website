<script setup lang="ts">
import SyncSimulation from './SyncSimulation.vue'
</script>

<template>
  <section class="text-content mb-10 content-box">
    <h1 class="mb-5.5">Real-Time Version Control for Godot</h1>
    <h2 class="text-center text-pretty mb-7.5">
      <strong class="font-semibold">Backstitch</strong> enables fast collaboration for dev teams,
      game jams, and classrooms.
    </h2>
    <p class="mb-8 bg-mauve-900">
      <SyncSimulation />
    </p>
    <div class="flex justify-center gap-5 sm:gap-20 flex-col sm:flex-row items-center text-xl">
      <div class="flex flex-1 justify-end">
        <RouterLink class="button" to="/getting-started">Try the alpha!</RouterLink>
      </div>
      <div class="flex flex-1 justify-start">
        <a
          class="button-secondary"
          href="https://github.com/inkandswitch/patchwork-godot-plugin/"
          target="_blank"
          rel="nofollow"
          >Visit on GitHub</a
        >
      </div>
    </div>
  </section>
</template>

<style scoped></style>
