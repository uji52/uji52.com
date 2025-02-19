<template>
  <Header msg="Top Page" />
  <Top msg="Top Page" />
  <Footer msg="Top Page" />
</template>

<script setup>
import Header from './components/Header.vue'
import Top from './components/Top.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

