<template>
  <v-app>
    <v-navigation-drawer expand-on-hover rail>
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-home-city"
          title="Dashboard"
          value="home"
          to="/"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-cog"
          title="Configuración"
          value="configuracion"
          to="/configuracion"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" density="compact">
      <v-toolbar-title>Panel Básico Vue/Vuetify</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        color="white"
        prepend-icon="mdi-logout"
        :loading="loggingOut"
        @click="handleLogout"
      >
        Cerrar sesión
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearSession } from '../services/sessionService'

const router = useRouter()
const loggingOut = ref(false)

const handleLogout = () => {
  loggingOut.value = true
  clearSession()
  router.replace({ name: 'login' })
  loggingOut.value = false
}
</script>

<style>
/* Estilos globales si son necesarios */
</style>