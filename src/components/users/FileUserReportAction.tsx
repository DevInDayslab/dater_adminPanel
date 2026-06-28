import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFileUserReport } from "@/hooks/useUsers"
import { REPORT_REASONS } from "@/lib/constants"
import { useAdminStore } from "@/stores/adminStore"

type FileUserReportActionProps = {
  userId: string
}

export function FileUserReportAction({ userId }: FileUserReportActionProps) {
  const [open, setOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState("")
  const fileReport = useFileUserReport(userId)
  const pushToast = useAdminStore((s) => s.pushToast)

  const submitReport = async () => {
    if (!selectedReason) return
    try {
      const result = await fileReport.mutateAsync(selectedReason)
      setOpen(false)
      setSelectedReason("")
      pushToast(
        result.warningIssued
          ? `Report filed. Warning milestone reached (${result.totalReports} total reports).`
          : `Report filed (${result.totalReports} total reports against this user).`
      )
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Failed to file report.")
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        File Report
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[min(32rem,calc(100%-2rem))] max-w-none gap-5 rounded-[12px] p-6 sm:max-w-none">
          <DialogHeader className="pr-8">
            <DialogTitle>File report</DialogTitle>
            <DialogDescription className="text-pretty">
              Adds one profile report against this user. Report milestones may trigger automatic warnings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
              Reason
            </Label>
            <Select value={selectedReason} onValueChange={(value) => value && setSelectedReason(value)}>
              <SelectTrigger className="h-10 w-full rounded-[14px]">
                <SelectValue>{selectedReason || "Select a reason"}</SelectValue>
              </SelectTrigger>
              <SelectContent className="min-w-[var(--anchor-width)]">
                {REPORT_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="-mx-6 -mb-6 mt-2 border-t bg-transparent p-6 pt-4 sm:justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitReport} disabled={!selectedReason || fileReport.isPending}>
              {fileReport.isPending ? "Filing…" : "File report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
