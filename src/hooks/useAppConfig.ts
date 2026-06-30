import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminApi } from "@/lib/api"
import type { AppConfig } from "@/types"

const MAX_SPLASH_BYTES = 2 * 1024 * 1024
const ALLOWED_SPLASH_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

function assertSplashFile(file: File) {
  if (!ALLOWED_SPLASH_TYPES.has(file.type)) {
    throw new Error("Use a JPEG, PNG, or WebP image.")
  }
  if (file.size > MAX_SPLASH_BYTES) {
    throw new Error("Image must be 2 MB or smaller.")
  }
}

export function useAdminAppConfig() {
  return useQuery({
    queryKey: ["admin", "app-config"],
    queryFn: () => adminApi.getAppConfig(),
  })
}

export function useUpdateAdminAppConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: { splashBackgroundS3Key: string | null }) => adminApi.updateAppConfig(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "app-config"] })
    },
  })
}

export function useUploadSplashBackground() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File): Promise<AppConfig> => {
      assertSplashFile(file)
      const presign = await adminApi.presignSplashUpload(file.type)
      const uploadResponse = await fetch(presign.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": presign.contentType },
      })
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image to storage.")
      }
      return adminApi.updateAppConfig({ splashBackgroundS3Key: presign.s3Key })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "app-config"] })
    },
  })
}
