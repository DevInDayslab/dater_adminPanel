import { useRef, useState } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/FieldGrid"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useAdminAppConfig,
  useUpdateAdminAppConfig,
  useUploadSplashBackground,
} from "@/hooks/useAppConfig"
import { useAdminStore } from "@/stores/adminStore"
import { formatDateTime } from "@/lib/formatters"

export function AppConfigPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)
  const configQuery = useAdminAppConfig()
  const uploadMutation = useUploadSplashBackground()
  const updateMutation = useUpdateAdminAppConfig()
  const pushToast = useAdminStore((s) => s.pushToast)

  const config = configQuery.data
  const previewUrl = localPreviewUrl ?? config?.splashImageUrl ?? null
  const isBusy = uploadMutation.isPending || updateMutation.isPending

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setLocalPreviewUrl(objectUrl)

    try {
      await uploadMutation.mutateAsync(file)
      setLocalPreviewUrl(null)
      URL.revokeObjectURL(objectUrl)
      pushToast("Splash background updated")
    } catch (error) {
      setLocalPreviewUrl(null)
      URL.revokeObjectURL(objectUrl)
      pushToast(error instanceof Error ? error.message : "Failed to upload splash image", "error")
    }
  }

  const handleRevert = async () => {
    try {
      await updateMutation.mutateAsync({ splashBackgroundS3Key: null })
      setLocalPreviewUrl(null)
      pushToast("Splash background reset to app default")
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Failed to reset splash image", "error")
    }
  }

  if (configQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  if (configQuery.isError) {
    return (
      <div className="admin-card p-8 text-center text-sm text-rose-600">
        Failed to load app config. Run migration 036 on the backend database.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="App config"
        description="Manage the auth landing background shown when logged-out users open the app. Changes appear on the next app launch."
      />

      <SectionCard
        title="Auth splash background"
        description="Portrait image recommended. JPEG, PNG, or WebP up to 2 MB."
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="shrink-0">
            <div className="mx-auto w-[280px] max-w-full overflow-hidden rounded-[14px] border border-border-card bg-surface-input shadow-sm">
              <div className="relative aspect-[9/16] w-full">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Auth splash background preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-text-muted">
                    Using the bundled default image in the mobile app.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            {config?.updatedAt ? (
              <p className="text-xs text-text-meta">
                Last updated {formatDateTime(config.updatedAt)}
              </p>
            ) : (
              <p className="text-sm text-text-secondary">
                No custom splash image is set. The mobile app uses its bundled default until you upload one.
              </p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => void handleFileChange(event)}
            />

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                disabled={isBusy}
                onClick={() => fileInputRef.current?.click()}
              >
                {isBusy ? "Uploading…" : "Replace image"}
              </Button>
              {config?.splashBackgroundS3Key ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isBusy}
                  onClick={() => void handleRevert()}
                >
                  Revert to default
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
