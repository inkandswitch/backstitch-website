<script setup lang="ts">
import { type Doc } from '@/content/docs-pages'
defineProps<{
  doc: Doc
  parentRoute: string
}>()
</script>

<template>
  <li>
    <router-link class="rounded-lg relative block py-2 px-4" :to="`${parentRoute}/${doc.route}`">{{
      doc.name
    }}</router-link>

    <ul v-if="doc.children && doc.children.length">
      <TocItem
        v-for="(child, index) in doc.children"
        :key="index"
        :doc="child"
        :parent-route="`${parentRoute}/${doc.route}`"
      />
    </ul>
  </li>
</template>

<style scoped>
li ul li a {
  margin-left: 2rem;
}

@media (hover: hover) {
  a:hover::after {
    border-bottom: 0.15rem dashed var(--color-primary-800);
    top: 0.15rem;
    bottom: 0.15rem;
    left: 1rem;
    right: 0.15rem;
    position: absolute;
    content: '';
    /* border-radius: 0.5rem; */
  }
}

.router-link-exact-active::after {
  content: '';
  position: absolute;
  top: 0.15rem;
  bottom: 0.15rem;
  left: 1rem;
  right: 0.15rem;
  border-bottom: 0.15rem solid var(--color-primary-800);
  /* border-radius: 0.5rem; */
}
</style>
