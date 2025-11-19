<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Recuperar Contraseña</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-alert
              v-if="successMessage"
              type="success"
              class="mb-4"
              border="start"
              variant="tonal"
            >
              {{ successMessage }}
            </v-alert>

            <v-alert
              v-else
              type="info"
              variant="tonal"
              class="mb-4"
            >
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </v-alert>

            <v-alert
              v-if="errorMessage"
              type="error"
              class="mb-4"
              border="start"
              variant="tonal"
            >
              {{ errorMessage }}
            </v-alert>

            <v-form ref="formRef" @submit.prevent="handleForgotPassword">
              <v-text-field
                v-model="email"
                label="Correo electrónico"
                name="email"
                prepend-inner-icon="mdi-email"
                type="email"
                variant="outlined"
                :rules="[rules.required, rules.email]"
                class="mb-4"
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                class="mb-3"
                :loading="loading"
                :disabled="loading"
              >
                Enviar enlace de recuperación
              </v-btn>

              <div class="text-center">
                <v-btn
                  variant="text"
                  color="primary"
                  to="/login"
                  class="text-none"
                >
                  <v-icon start>mdi-arrow-left</v-icon>
                  Volver al inicio de sesión
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
import { ref } from 'vue'
import { requestPasswordReset } from '../services/authService'

const email = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const formRef = ref(null)

const rules = {
  required: (value) => !!value || 'Este campo es obligatorio',
  email: (value) =>
    /.+@.+\..+/.test(value) || 'Ingresa un correo electrónico válido'
}

const handleForgotPassword = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  const validation = await formRef.value?.validate()
  if (!validation?.valid) return

  loading.value = true
  try {
    await requestPasswordReset(email.value)
    successMessage.value =
      'Si el correo existe en nuestra base de datos recibirás un enlace en los próximos minutos.'
    email.value = ''
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      'No pudimos procesar la solicitud, intenta nuevamente.'
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

