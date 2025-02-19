<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button class="btn btn-primary" type="button" @click="count++">count is {{ count }}</button>
    <p>Vue Test Main</p>
  </div>
  <p class="read-the-docs">@uji52</p>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>

