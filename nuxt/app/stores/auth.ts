import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token', { default: () => null })
  const config = useRuntimeConfig()

  const login = async (username: string, password: string) => {
    try {
      const response: any = await $fetch(`${config.public.apiBase}/auth/login`, {
        method: 'POST',
        body: { username, password }
      })
      
      token.value = response.token
      return { success: true }
    } catch (error: any) {
      const message = error.data?.message || 'Unable to connect to server'
      return { success: false, message }
    }
  }

  const logout = () => {
    token.value = null
  }

  return { token, login, logout }
})