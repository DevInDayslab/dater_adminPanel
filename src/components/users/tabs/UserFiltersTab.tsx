import { FieldGrid, SectionCard, TagChips } from "@/components/shared/FieldGrid"
import type { UserFiltersDetail } from "@/types"
import { formatHeightInches } from "@/lib/formatters"

type UserFiltersTabProps = {
  filters: UserFiltersDetail
  livingInCity: string | null
}

export function UserFiltersTab({ filters: f, livingInCity }: UserFiltersTabProps) {
  return (
    <div className="space-y-6">
      <SectionCard title="Scalar filters">
        <FieldGrid
          fields={[
            { label: "Distance Pref (km)", value: f.distancePrefKm },
            { label: "Age Min / Max", value: `${f.ageMin} – ${f.ageMax}` },
            { label: "Height Min / Max", value: `${formatHeightInches(f.minHeightInches)} – ${formatHeightInches(f.maxHeightInches)}` },
            { label: "Expand Age Range", value: f.expandAgeRange ? "Yes" : "No" },
            { label: "Expand Distance", value: f.expandDistance ? "Yes" : "No" },
            { label: "Only Verified Profiles", value: f.onlyVerifiedProfiles ? "Yes" : "No" },
            { label: "Show Others If Run Out", value: f.showOtherPeopleIfRunOut ? "Yes" : "No" },
          ]}
        />
      </SectionCard>

      <SectionCard title="Location anchor">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[10px] border border-border-card p-4">
            <p className="text-xs font-medium text-text-muted uppercase">Preferred location (premium switch-city)</p>
            <p className="mt-2 text-sm">{f.preferredLocationCity ?? "—"}</p>
          </div>
          <div className="rounded-[10px] border border-border-card p-4">
            <p className="text-xs font-medium text-text-muted uppercase">Living in city</p>
            <p className="mt-2 text-sm">{livingInCity ?? "—"}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Multi-select preferences">
        <div className="space-y-4">
          {[
            ["Preferred Genders", f.preferredGenders],
            ["Languages", f.languages],
            ["Marital Statuses", f.maritalStatuses],
            ["Looking For", f.lookingFor],
            ["Drinking", f.drinking],
            ["Smoking", f.smoking],
            ["Exercise", f.exercise],
            ["Religion", f.religion],
            ["Education", f.education],
            ["Star Sign", f.starSign],
            ["Kids", f.kids],
            ["Political", f.political],
            ["Pets", f.pets],
            ["Ethnicity", f.ethnicity],
            ["Pronouns", f.pronouns],
          ].map(([label, items]) => (
            <div key={String(label)}>
              <p className="mb-2 text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
                {label}
              </p>
              <TagChips items={items as string[]} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
