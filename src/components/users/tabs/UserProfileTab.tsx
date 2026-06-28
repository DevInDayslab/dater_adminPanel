import { FieldGrid, SectionCard, TagChips } from "@/components/shared/FieldGrid"
import { Progress } from "@/components/ui/progress"
import type { UserProfileDetail } from "@/types"
import { formatDate, formatDateTime, formatHeightInches, formatIpAddress } from "@/lib/formatters"

export function UserProfileTab({ profile: p }: { profile: UserProfileDetail }) {

  return (
    <div className="space-y-6">
      <SectionCard title="Account & Identity">
        <FieldGrid
          fields={[
            { label: "User ID", value: <span className="font-mono text-xs">{p.id}</span> },
            { label: "Phone E.164", value: p.phoneE164 },
            { label: "Phone Verified", value: p.isPhoneVerified ? "Yes" : "No" },
            { label: "Created IP", value: formatIpAddress(p.accountCreatedIpAddress) },
            { label: "Created Device", value: p.accountCreatedDeviceId },
            { label: "Created User Agent", value: <span className="break-all text-xs">{p.accountCreatedUserAgent}</span> },
            { label: "Consent Source", value: p.consentSource },
            { label: "Age Agreement", value: formatDateTime(p.ageAgreementTimestamp) },
            { label: "Be Kind Accepted", value: formatDateTime(p.beKindAcceptedAt) },
            { label: "Terms Accepted", value: formatDateTime(p.termsAcceptedAt) },
            { label: "Privacy Accepted", value: formatDateTime(p.privacyAcceptedAt) },
          ]}
        />
      </SectionCard>

      <SectionCard title="Core Profile">
        <FieldGrid
          fields={[
            { label: "Name", value: p.name },
            { label: "Age", value: p.ageYears },
            { label: "Date of Birth", value: formatDate(p.dateOfBirth) },
            { label: "Gender", value: p.gender },
            { label: "Gender Main", value: p.genderMain },
            { label: "Show Gender on Profile", value: p.showGenderOnProfile ? "Yes" : "No" },
            { label: "Marital Status", value: p.maritalStatus },
            { label: "Height", value: formatHeightInches(p.heightInches) },
            { label: "Bio", value: p.bio },
            { label: "Preset Message", value: p.presetMessage },
            { label: "Ethnicity", value: p.ethnicity },
            { label: "Job Title", value: p.occupationJobTitle },
            { label: "Company", value: p.occupationCompany },
            { label: "Institution", value: p.educationInstitutionName },
            { label: "Passing Year", value: p.educationPassingYear },
          ]}
        />
      </SectionCard>

      <SectionCard title="Lifestyle Basics">
        <FieldGrid
          fields={[
            { label: "Drinking", value: p.drinking },
            { label: "Smoking", value: p.smoking },
            { label: "Exercise", value: p.exercise },
            { label: "Religion", value: p.religion },
            { label: "Education", value: p.education },
            { label: "Star Sign", value: p.starSign },
            { label: "Kids", value: p.kids },
            { label: "Political Leanings", value: p.politicalLeanings },
            { label: "Pets", value: p.pets },
          ]}
        />
      </SectionCard>

      <SectionCard title="Multi-select profile fields">
        <div className="space-y-4">
          {[
            ["Dating Preferences", p.datingPreferences],
            ["Looking For", p.lookingFor],
            ["Interests", p.interests],
            ["Pronouns", p.pronouns],
            ["Languages", p.languages],
            ["Gender More Options", p.genderMoreOptions],
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

      <SectionCard title="Written prompts">
        <div className="grid gap-3 md:grid-cols-3">
          {p.writtenPrompts.map((prompt) => (
            <div key={prompt.id} className="rounded-[10px] border border-border-card p-4">
              <p className="text-xs font-medium text-text-muted">{prompt.promptQuestion}</p>
              <p className="mt-2 text-sm leading-5 text-black">“{prompt.promptAnswer}”</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Location">
        <FieldGrid
          fields={[
            { label: "Living In City", value: p.livingInCity },
            { label: "City Mode", value: p.livingInCityMode },
            { label: "Home Town", value: p.homeTownCity },
            {
              label: "GPS (internal)",
              value:
                p.locationLat && p.locationLng
                  ? `${p.locationLat.toFixed(4)}, ${p.locationLng.toFixed(4)}`
                  : "—",
            },
            { label: "Location Granted", value: p.locationGranted ? "Yes" : "No" },
          ]}
        />
      </SectionCard>

      <SectionCard title="Onboarding & flags">
        <div className="space-y-4">
          <FieldGrid
            fields={[
              { label: "Onboarding Step", value: p.onboardingStep },
              { label: "Completed At", value: formatDateTime(p.onboardingCompletedAt) },
              { label: "Hide My Name", value: p.hideMyName ? "Yes" : "No" },
              { label: "Notifications Granted", value: p.notificationsGranted ? "Yes" : "No" },
            ]}
          />
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-text-muted">Profile completion</span>
              <span>{p.profileCompletionPercentage}%</span>
            </div>
            <Progress value={p.profileCompletionPercentage} className="h-2" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Timestamps">
        <FieldGrid
          fields={[
            { label: "Created", value: formatDateTime(p.createdAt) },
            { label: "Updated", value: formatDateTime(p.updatedAt) },
            { label: "Last Active", value: formatDateTime(p.lastActiveAt) },
            { label: "Last Login", value: formatDateTime(p.lastLoginAt) },
            { label: "Last Logout", value: formatDateTime(p.lastLogoutAt) },
            { label: "Profile Updated", value: formatDateTime(p.profileUpdatedAt) },
          ]}
        />
      </SectionCard>
    </div>
  )
}
