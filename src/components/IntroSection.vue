<script setup lang="ts">
import GithubIcon from './icons/GithubIcon.vue'
import DiscordIcon from './icons/DiscordIcon.vue'
import SyncSimulation from './SyncSimulation.vue'
</script>

<template>
  <section class="mb-10 content-box">
    <h1 class="mb-5.5">Real-Time Version Control for Godot</h1>
    <h2 class="text-center text-pretty mb-7.5">
      <strong class="font-semibold">Backstitch</strong> enables fast collaboration for dev teams,
      game jams, and classrooms.
    </h2>
    <p class="mb-8 bg-mauve-900">
      <SyncSimulation />
    </p>
    <div class="flex justify-center gap-5 sm:gap-20 flex-col sm:flex-row items-center text-xl">
      <RouterLink class="button" to="/docs">Try the alpha!</RouterLink>
      <a
        class="button-secondary flex gap-2 justify-center items-center"
        href="https://discord.gg/SkW9vem5Ez"
        target="_blank"
        rel="nofollow"
      >
        <DiscordIcon class="fill-secondary-500 w-8" /> Join the Discord!
      </a>
      <a
        class="button-secondary flex gap-1 justify-center items-center"
        href="https://github.com/inkandswitch/backstitch/"
        ><GithubIcon class="fill-secondary-500 w-8" /> GitHub</a
      >
    </div>
  </section>
</template>

<style scoped></style>
