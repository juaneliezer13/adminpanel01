<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-alert
              v-if="errorMessage"
              type="error"
              class="mb-4"
              border="start"
              variant="tonal"
              density="comfortable"
            >
              {{ errorMessage }}
            </v-alert>

            <v-form ref="formRef" @submit.prevent="handleLogin">
              <v-text-field
                v-model="credentials.email"
                label="Correo electrónico"
                name="email"
                prepend-inner-icon="mdi-email"
                type="email"
                variant="outlined"
                :rules="[rules.required, rules.email]"
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model="credentials.password"
                id="password"
                label="Contraseña"
                name="password"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="[rules.required]"
                @click:append-inner="showPassword = !showPassword"
                class="mb-3"
              ></v-text-field>

              <v-checkbox
                v-model="credentials.rememberMe"
                label="Recordarme"
                color="primary"
                hide-details
                class="mb-3"
              ></v-checkbox>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                :disabled="loading"
                class="mb-3"
              >
                Iniciar Sesión
              </v-btn>

              <div class="text-center">
                <v-btn
                  variant="text"
                  color="primary"
                  to="/olvido-contrasena"
                  class="text-none"
                >
                  ¿Olvidaste tu contraseña?
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login as loginRequest } from '../services/authService'
import { persistSession } from '../services/sessionService'

const router = useRouter()
const route = useRoute()

const formRef = ref(null)
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const credentials = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const rules = {
  required: (value) => !!value || 'Este campo es obligatorio',
  email: (value) =>
    /.+@.+\..+/.test(value) || 'Ingresa un correo electrónico válido'
}

const handleLogin = async () => {
  errorMessage.value = ''
  const validation = await formRef.value?.validate()
  if (!validation?.valid) return

  loading.value = true
  try {
    const response = await loginRequest({
      email: credentials.email,
      password: credentials.password
    })
    if (!response?.token) {
      throw new Error('Respuesta inválida del servidor')
    }
    persistSession(response, credentials.rememberMe)
    const redirect = route.query.redirect
    router.push(redirect || { name: 'home' })
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'No pudimos iniciar sesión, intenta nuevamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>

