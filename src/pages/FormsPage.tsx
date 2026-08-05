import { useState } from "react"
import { ArrowLeft, ExternalLink, Paperclip } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { PageHeader } from "@/components/layout/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { useFormDetail, useFormsList } from "@/hooks/useForms"
import { formatDateTime } from "@/lib/formatters"

function isPdfUrl(url: string | null | undefined) {
  if (!url) return false
  return /\.pdf($|\?)/i.test(url) || url.toLowerCase().includes("application/pdf")
}

function FormDetailView({
  formId,
  onBack,
}: {
  formId: string
  onBack: () => void
}) {
  const detailQuery = useFormDetail(formId)
  const contact = detailQuery.data?.contact

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="-ml-2 w-fit gap-2 px-2 text-text-secondary hover:text-black"
      >
        <ArrowLeft className="size-4" />
        Back to forms
      </Button>

      {detailQuery.isLoading ? (
        <div className="admin-card space-y-4 p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full max-w-md" />
        </div>
      ) : detailQuery.isError || !contact ? (
        <div className="admin-card p-6 text-sm text-[#FD1C1C]">
          Could not load this form submission.
        </div>
      ) : (
        <>
          <PageHeader
            title={contact.name}
            description={`Submitted ${formatDateTime(contact.createdAt)}`}
          />

          <div className="admin-card space-y-6 p-4 md:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 text-sm">
                <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
                  Email
                </p>
                <a href={`mailto:${contact.email}`} className="hover:underline">
                  {contact.email}
                </a>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
                  Mobile
                </p>
                <a href={`tel:${contact.mobile}`} className="hover:underline">
                  {contact.mobile}
                </a>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
                  IP address
                </p>
                <p>{contact.ipAddress || "—"}</p>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
                  Submitted
                </p>
                <p>{formatDateTime(contact.createdAt)}</p>
              </div>
              <div className="space-y-1 text-sm sm:col-span-2">
                <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
                  Description
                </p>
                <p className="whitespace-pre-wrap">{contact.description}</p>
              </div>
            </div>

            {contact.attachmentUrl ? (
              <div className="space-y-3 border-t border-border-subtle pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
                    Attachment
                  </p>
                  <a
                    href={contact.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                  >
                    Open full size
                    <ExternalLink className="size-4" />
                  </a>
                </div>
                {isPdfUrl(contact.attachmentUrl) ? (
                  <a
                    href={contact.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-[14px] border border-border-subtle bg-surface-input px-4 text-sm font-medium hover:bg-surface-hover"
                  >
                    View PDF attachment
                    <ExternalLink className="size-4" />
                  </a>
                ) : (
                  <a
                    href={contact.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full max-w-3xl"
                  >
                    <div className="flex min-h-[320px] items-center justify-center rounded-[10px] border border-border-subtle bg-surface-input p-4">
                      <img
                        src={contact.attachmentUrl}
                        alt="Contact form attachment"
                        className="max-h-[560px] w-auto max-w-full object-contain"
                      />
                    </div>
                  </a>
                )}
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}

export function FormsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeFormId = searchParams.get("formId")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)

  const formsQuery = useFormsList({ search: debouncedSearch, page })
  const items = formsQuery.data?.items ?? []
  const pagination = formsQuery.data?.pagination

  const openForm = (formId: string) => {
    setSearchParams({ formId })
  }

  const closeForm = () => {
    setSearchParams({})
  }

  if (activeFormId) {
    return <FormDetailView formId={activeFormId} onBack={closeForm} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Forms"
        description="Contact form submissions from the landing page."
      />

      <div className="admin-card p-4 md:p-5">
        <div className="w-full">
          <div className="space-y-2">
            <Label
              htmlFor="forms-search"
              className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase"
            >
              Search
            </Label>
            <Input
              id="forms-search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Name, email, or mobile"
              className="h-10 w-full rounded-[14px] border-[0.8px] border-border-input"
            />
          </div>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        {formsQuery.isError ? (
          <div className="space-y-2 p-8 text-center text-sm text-[#FD1C1C]">
            <p>Unable to load form submissions.</p>
            {formsQuery.error instanceof Error ? (
              <p className="text-text-secondary">{formsQuery.error.message}</p>
            ) : null}
          </div>
        ) : (
          <div className="admin-table-scroll">
            <table className="min-w-[980px] w-full border-collapse">
              <thead>
                <tr className="bg-surface-input">
                  {["Submitted", "Name", "Email", "Mobile", "Description", "Attachment"].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-xs font-medium text-text-muted"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {formsQuery.isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index} className="border-t border-border-subtle">
                      {Array.from({ length: 6 }).map((__, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3">
                          <Skeleton className="h-4 w-full max-w-[140px]" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : items.length ? (
                  items.map((form) => (
                    <tr
                      key={form.id}
                      className="cursor-pointer border-t border-border-subtle hover:bg-surface-hover"
                      onClick={() => openForm(form.id)}
                    >
                      <td className="px-4 py-3 text-sm">{formatDateTime(form.createdAt)}</td>
                      <td className="px-4 py-3 text-sm font-medium">{form.name}</td>
                      <td className="px-4 py-3 text-sm">{form.email}</td>
                      <td className="px-4 py-3 text-sm">{form.mobile}</td>
                      <td className="max-w-[280px] truncate px-4 py-3 text-sm text-text-secondary">
                        {form.description}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {form.hasAttachment ? (
                          <Badge
                            variant="outline"
                            className="gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
                          >
                            <Paperclip className="size-3.5" />
                            Yes
                          </Badge>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-sm text-text-secondary"
                    >
                      No form submissions match this search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {pagination ? (
          <div className="flex flex-col gap-3 border-t border-border-subtle px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-secondary">
              Page {pagination.page} of {pagination.totalPages} ·{" "}
              {pagination.total.toLocaleString()} submissions
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1 || formsQuery.isFetching}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.totalPages || formsQuery.isFetching}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
