import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AdminConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmationPhrase: string
  confirmLabel?: string
  onConfirm: () => void | Promise<void>
  isPending?: boolean
  destructive?: boolean
  children?: React.ReactNode
}

export function AdminConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmationPhrase,
  confirmLabel = "Confirm",
  onConfirm,
  isPending = false,
  destructive = false,
  children,
}: AdminConfirmDialogProps) {
  const [typed, setTyped] = useState("")

  useEffect(() => {
    if (!open) setTyped("")
  }, [open])

  const phraseMatches =
    typed.trim().toLowerCase() === confirmationPhrase.trim().toLowerCase()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(32rem,calc(100%-2rem))] max-w-none gap-5 rounded-[12px] p-6 sm:max-w-none">
        <DialogHeader className="pr-8">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-pretty">{description}</DialogDescription>
        </DialogHeader>

        {children}

        <div className="space-y-2">
          <Label htmlFor="admin-confirm-input" className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
            Type <span className="text-black">{confirmationPhrase}</span> to confirm
          </Label>
          <Input
            id="admin-confirm-input"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            placeholder={confirmationPhrase}
            className="h-10 rounded-[14px]"
            autoComplete="off"
          />
        </div>

        <DialogFooter className="-mx-6 -mb-6 mt-2 border-t bg-transparent p-6 pt-4 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={!phraseMatches || isPending}
            onClick={onConfirm}
          >
            {isPending ? "Working…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
