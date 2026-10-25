import { useAuthStore } from '~/stores/auth'

export const useApi = <T>(request: string, opts?: any) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  return useFetch<T>(request, {
    baseURL: config.public.apiBase,
    ...opts,
    headers: {
      ...opts?.headers,
      Authorization: authStore.token ? `Bearer ${authStore.token}` : ''
    }
  })
}