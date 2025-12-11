import { toast } from 'vue3-toastify'

export const useAlerts = () => {
  const info = (message: string) => {
    toast.info(message)
  }

  const error = (message: string) => {
    toast.error(message)
  }

  const success = (message: string) => {
    toast.success(message)
  }

  return {
    info,
    error,
    success,
  }
}
