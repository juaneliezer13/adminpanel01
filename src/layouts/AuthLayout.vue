<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { defineOptions } from 'vue'

defineOptions({
  name: 'AuthLayout'
})

// Layout simple para pantallas de autenticación sin navegación
</script>

<style scoped>
/* Layout limpio para autenticación */
</style>

