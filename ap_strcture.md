

# Dater Admin Panel — Full Feature Specification

**Version 1.0 · For Cursor / Engineering Use**

---


## 1. Tech Stack Decision

**Recommended: Vite + React + TypeScript**

- Vite for instant hot-reload, zero config.
- React + TypeScript for type safety across all the complex user-detail shapes.
- **shadcn/ui** for all components (tables, dialogs, badges, tabs, dropdowns). Copy-owned components mean full control over styling.
- **Tailwind CSS** for layout, spacing, and utility classes.
- **TanStack Query (React Query v5)** for all data fetching — handles caching, background refresh, and paginated tables automatically.
- **TanStack Table (React Table v8)** for all data-grid views — sorting, filtering, and pagination built-in.
- **React Router v6** for tab routing (each major section is a URL route).
- **Recharts** for all charts/graphs on the dashboard.
- **Zustand** for lightweight global state (currently logged-in admin identity, active toast queue).

**Routing Structure:**

```
/                        → redirect to /dashboard
/dashboard               → Global Dashboard
/users                   → User List
/users/:userId           → User Detail (tabbed)
/moderation              → Moderation Queue
/reports                 → Reports Queue
/revenue                 → Revenue & Purchases
/notifications           → Broadcast Tool
/settings                → Admin Settings (admin user management)
```

---



---

## 3. Global Layout (Shell)

**Sidebar (left, always visible):**

```
[ DATER ADMIN ]           ← logo / wordmark

  Dashboard
  Users
  Moderation Queue        ← badge: pending photo count
  Reports                 ← badge: open report count
  Revenue
  Broadcast

  ─────────────────
  Settings
  [ Admin name + logout ]
```

- Sidebar is collapsible to icon-only on smaller screens.
- Active route is highlighted.
- Notification badges on Moderation Queue and Reports update every 60 seconds via polling.

**Top bar:**

- Global search input (searches users by phone number, name, or UUID — navigates directly to `/users/:userId` on match).
- Current admin name and role badge (e.g. `SUPER_ADMIN`).

---

## 4. Tab 1 — Global Dashboard (`/dashboard`)

The command centre. All data is **read-only** here. No actions.

### 4.1 KPI Cards Row (top)

Six cards in a single row. Each card shows the primary number large, a label below, and a subtle delta vs the previous period (e.g. `+12% vs last 7d`).
in these things these parameters show the info and have a variable like a selector on top right of 7 days 30 days 1-6 months year to date all etc which will apply to all these parameters intead of having independent ones for each

| Card                    | Metric                                                         |
| ----------------------- | -------------------------------------------------------------- |
| Total Users             | `COUNT(users)` where `deleted_at IS NULL`                      |
| Active Today (DAU)      | distinct users with `last_active_at >= today`                  |
| Active This Month (MAU) | distinct users with `last_active_at >= 30 days ago`            |
| Premium Users           | `COUNT` where `premium_status = 'ACTIVE'`                      |
| Total  Reports          | open/unreviewed rows in `reports` table                        |
| Pending Photo Review    | `user_photos` where `moderation_status = 'PENDING_MODERATION'` |

### 4.2 User Growth Chart

- Line chart: new registrations per day for the last 30 days.
- X-axis: date. Y-axis: count.
- Toggle between 7d / 30d / 90d.

### 4.3 Gender Breakdown

- Donut/pie chart: proportion of `gender_main` values (`Woman` / `Man` / `Nonbinary`).
- Shows absolute number + percentage on hover.

### 4.4 Account State Distribution

- Horizontal bar chart showing count per `account_state` value: `ACTIVE`, `PAUSED`, `PRIVACY_MODE`, `HIDDEN_BY_MODERATION`, `BANNED`, `UNDERAGE_BLOCKED`, `PENDING_CAPTCHA`, `DELETED`

### 4.5 Revenue Summary

- Three mini-cards: Boosts purchased, Comments purchased, Premium subscriptions — each with time filter toggle (7d / 30d / 6m / 1y).
- Below: a bar chart of total purchase events per day for the selected window.


### 4.6 Onboarding Funnel

- Horizontal funnel bar chart showing how many users are currently at each `onboarding_step`.
- Helps identify where users are dropping off.

### 4.7 Verification Stats

- Total verified users vs unverified.
- Verification attempt success rate (from `user_verification_sessions`: success count / total count).

---

## 5. Tab 2 — User List (`/users`)

A searchable, filterable, paginated table of all users.

### 5.1 Search & Filter Bar

Inputs that filter the table live (with debounce):

- **Search:** free text across `name`, `phone_e164`, `id` (UUID).
- **Account State:** multi-select dropdown (`ACTIVE`, `BANNED`, `PAUSED`, etc.).
- **Premium:** toggle (All / Premium only / Free only).
- **Verified:** toggle (All / Verified / Unverified).
- **Gender:** multi-select.
- **Date Joined:** date range picker.
- **Sort:** `created_at DESC` (default), `last_active_at DESC`, `name ASC`.

### 5.2 Table Columns

|Column|Source|
|---|---|
|Avatar (primary photo thumbnail)|`user_photos` where `is_primary = true`|
|Name|`users.name`|
|Phone|`users.phone_e164`|
|Age|`users.age_years`|
|Gender|`users.gender_main`|
|Account State|`users.account_state` — rendered as a colour-coded badge|
|Premium|`users.premium_status` — badge|
|Verified|`users.is_verified` — icon|
|Joined|`users.created_at` — relative time (e.g. "3 months ago")|
|Last Active|`users.last_active_at` — relative time|
|Reports Against|count from `reports` where they are the subject|
|Actions|`View` button → `/users/:userId`|

- Pagination: 25 rows per page, with page number controls.
- Clicking any row also navigates to the detail page.
- Table is sortable by clicking column headers.

---

## 6. Tab 3 — User Detail (`/users/:userId`)

The most complex view. Divided into **8 sub-tabs**. Loads the user's identity card at the top regardless of which sub-tab is active.

### 6.0 Identity Card (always visible, top of page)

A persistent header strip showing:

- Primary photo (thumbnail, 64px).
- Name, age, gender, city (`living_in_city`).
- Phone number (masked by default, click to reveal — logged as an admin access event).
- User UUID.
- `account_state` badge (large, colour-coded).
- `is_verified` badge, `premium_status` badge.
- `created_at` and `last_active_at`.
- **Quick Action Buttons** (role-gated — see section 6.8): `Issue Warning` · `Ban` · `Unban` · `Delete Account` · `Edit Profile`

---

### 6.1 Sub-tab: Profile

All stored profile data displayed in labelled read-only fields, grouped into sections:

**Account & Identity:** `id`, `phone_e164`, `is_phone_verified`, `account_created_ip_address`, `account_created_device_id`, `account_created_user_agent`, `consent_source`, `age_agreement_timestamp`, `be_kind_accepted_at`, `terms_accepted_at`, `privacy_accepted_at`

**Core Profile:** `name`, `age_years`, `date_of_birth`, `gender`, `gender_main`, `show_gender_on_profile`, `marital_status`, `height_inches` (display as ft/in), `bio`, `preset_message`, `ethnicity`, `occupation_job_title`, `occupation_company`, `education_institution_name`, `education_passing_year`

**Lifestyle Basics:** `drinking`, `smoking`, `exercise`, `religion`, `education`, `star_sign`, `kids`, `political_leanings`, `pets`

**Multi-select Arrays (rendered as tag chips):** Dating preferences, looking for, interests, pronouns, languages, gender more options

**Written Prompts:** All 3 prompt Q&As displayed as quote cards.

**Location:** `living_in_city`, `living_in_city_mode`, `home_town_city`. GPS location shown as a map pin (lat/lng — for internal use only, never expose to other users). `location_granted` flag.

**Onboarding State:** `onboarding_step`, `onboarding_completed_at`, `profile_completion_percentage` (shown as a progress bar).

**Flags:** `hide_my_name`, `notifications_granted`, all permission flags.

**Timestamps:** `created_at`, `updated_at`, `last_active_at`, `last_login_at`, `last_logout_at`, `profile_updated_at`.

---

### 6.2 Sub-tab: Photos & Verification

**Profile Photos Grid:**

All rows from `user_photos` (including soft-deleted and failed moderation), displayed as a grid of cards.

Each photo card shows:

- The image (presigned S3 URL).
- `photo_order` number.
- `is_primary` flag.
- `moderation_status` badge: `APPROVED` (green) / `PENDING_MODERATION` (yellow) / `FAILED_MODERATION` (red) / `PENDING_GENDER_REVIEW` (orange).
- `uploaded_at` timestamp.
- `deleted_at` if soft-deleted.
- Admin actions per photo: **Approve**, **Reject**, **Delete** (with confirmation dialog).

**Verification Panel:**

Displayed side-by-side:

- Left: Verification selfie (`users.verification_selfie_s3_key` — presigned S3 URL).
- Right: All approved profile photos.

Below this, a table of all rows from `user_verification_sessions` for this user: `created_at`, `status`, `liveness_confidence` (percentage), `failure_reason`, `aws_session_id`.

Admin action: **Mark as Manually Verified** (sets `is_verified = true` with an audit log entry).

---

### 6.3 Sub-tab: Discovery Filters

Displays what this user has set as their match preferences — useful for understanding their experience if they report issues with the feed.

**Scalar Filters:** `distance_pref_km`, `age_min`/`age_max`, `min_height_inches`/`max_height_inches`, `expand_age_range`, `expand_distance`, `only_verified_profiles`, `show_other_people_if_run_out`

**Location:** `preferred_location_city` (premium switch-city) vs `living_in_city` — displayed side by side so it's clear which city their feed is anchored to.

**Multi-select Preferences (all rendered as tag chips):** Preferred genders, languages, marital statuses, looking for, drinking, smoking, exercise, religion, education, star sign, kids, political, pets, ethnicity, pronouns.

This section is read-only. No admin editing needed here.

---

### 6.4 Sub-tab: Trust & Safety



**Account State Panel:**

Current `account_state` displayed prominently.

All state transitions available as buttons (only states that are valid transitions from the current state are enabled):

- **Pause Account** → sets `PAUSED`, prompts for `paused_until` date.
- **Hide (Shadowban)** → sets `HIDDEN_BY_MODERATION`, sets `profile_hidden_at`.
- **Hard Ban** → sets `BANNED`. Requires a required text field: reason (stored in `moderation_actions_log`).
- **Unban / Restore** → sets back to `ACTIVE`.
- **Mark Underage** → sets `UNDERAGE_BLOCKED`, prompts for `underage_until` date.
- **Delete Account** → soft delete (`deleted_at`). Requires typing the user's name to confirm.

Warning counters displayed:

- `moderation_warning_count` (total)
- `moderation_consecutive_warning_count`
- `moderation_warnings_acknowledged`

**Issue Warning** button: opens a dialog with a required reason dropdown (e.g. Inappropriate Photo, Harassment in Chat, Fake Profile, Hate Speech, Spam) plus optional free-text notes. On submit, increments both warning counters and writes to `moderation_actions_log`.

**Moderation Actions Log:**

A reverse-chronological timeline of all rows from `moderation_actions_log` for this user: `action_type` (Warning / Ban / Unban / Photo Removed / Shadowban / etc.) · `reason` · `performed_by` (admin name) · `created_at`

**Reports Against This User:**

Table of all rows from `reports` where this user is the subject: `created_at` · `reporter_name` (link to reporter's profile) · `content_type`(PROFILE / STORY / CHAT) · `reason` · `status`

**Reports Filed By This User:**

Same table layout but where this user is the reporter. Useful for identifying serial false-reporters.

**Blocks:**

List of users this person has blocked (and who has blocked them, if exposed in schema).

---

### 6.5 Sub-tab: Content (Story & Active Media)

**Active Story:**

If the user has an active story (`expires_at > now`):

- Story media rendered (image or video player).
- `audience` (EVERYONE / FRIENDS_ONLY).
- `created_at`, `expires_at`.
- Story interactions: view count, like count, comment count (from `story_interactions`).

Story admin actions:

- **Remove Story** (soft deletes `stories` row, writes to `moderation_actions_log`).

**Story History:**

Table of all past stories (including deleted): `created_at` · `expires_at` · `media_type` · `audience` · `deleted_at` · view/like counts.

Clicking a row expands the media preview and its interactions.

---

### 6.6 Sub-tab: Chat Threads

SUPER_ADMIN only. This section is deliberately gated because it is the highest privacy-risk area.

A warning banner is shown: _"Chat content is private. Access is logged. Only open threads when there is an active report or moderation reason."_

Every admin who opens this sub-tab generates a row in an `admin_chat_access_log` table (userId, adminId, timestamp). This log should be auditable.

**Thread List:**

Table of all `chat_threads` this user participates in: `thread_id` · `other participant name` (link to their profile) · `thread_type` (DIRECT / ADMIN_DM) · `last_message_at` · `relationship_state` · `is_unlocked` (from `chat_restrictions`)

Clicking a thread opens a read-only chat view panel (right side or modal):

- Messages rendered in a chat bubble UI (them vs the user), oldest at top.
- `message_text`, `message_type`, `created_at` shown per message.
- Soft-deleted messages shown as `[message deleted]` placeholders.
- `reply_to_message_id` links resolve and show the quoted message.
- If a report references this thread, the reported message is highlighted in red.

Admin actions on a thread:

- **Delete Message** (sets `deleted_at` on a specific message, logs to `moderation_actions_log`).
- **End Thread** (sets `relationship_state = CHAT_ENDED`).

---

### 6.7 Sub-tab: Social Graph

**Friends:**

Table of all accepted friendships from `friendships`: Columns: Friend name (link to their profile) · Friend's account state badge · friendship created date.

**Pending Requests Sent / Received:**

Rows from `user_interactions` where `interaction_type = 'REQUEST'` and `status = 'PENDING'`:

- Sent requests table: to whom, sent at, comment text (if `COMMENT_REQUEST`).
- Received requests table: from whom, received at.

**Notifications Inbox:**

Last 50 rows from `notification_events` for this user: `event_type` · `actor name` (link) · `created_at` · `is_read`

**Active Sessions:**

Table of all rows from `user_sessions`: `device_id` · `ip_address` · `user_agent` · `last_seen_at` · `expires_at` · `revoked_at`

Admin action: **Revoke Session** (sets `revoked_at`, forces logout on that device).

**Push Tokens:**

Table from `user_push_tokens`: `platform` · `device_id` · `is_active` · `last_seen_at`.

---

### 6.8 Sub-tab: Revenue & Entitlements

**Premium Status:**

Current `premium_status` badge · `premium_plan_code` · `premium_started_at` · `premium_expires_at`.

Admin action: **Grant Premium** (prompts for plan code and expiry, with a required reason field — for CS/support use cases).

**Wallets:**

Two wallet cards side by side:

- Boost Wallet: `remaining_credits` from `user_boost_wallet`.
- Comment Wallet: `remaining_paid_comments` from `user_comment_wallet`.

**Active Boost:**

If a row exists in `user_boost_activations` with an active window: show start time, end time, status.

**Purchase History:**

Full table of `user_purchases`: `created_at` · `item_type` (SUBSCRIPTION / BOOST / UNLOCK_CHAT) · `pack_code` · `amount` · `quantity`· `transaction_id`

Sorted newest first. Shows total spend at the top.

**Chat Unlocks:**

Table of `chat_unlock_events` — which conversations this user has unlocked, and when.

**Daily Profile View Usage:**

`user_daily_profile_view_usage` — current day's count vs free tier limit (~20). Shows if they are hitting limits.

---

## 7. Tab 4 — Moderation Queue (`/moderation`)

The main workflow screen for content moderators. This is where photos needing review are actioned.

### 7.1 Photo Moderation Queue

**Queue header:**

- Total pending count (badge).
- Filter: `PENDING_MODERATION` (default) / `FAILED_MODERATION` / `PENDING_GENDER_REVIEW`.

**Queue layout: card-based review flow.**

Each card shows:

- The photo (large, presigned S3).
- User name, age, gender (link to their user detail).
- User's `account_state` badge (so you can see at a glance if they're already banned).
- `uploaded_at` timestamp.
- User's other approved photos as thumbnails (for context — does this photo match who they claim to be?).

Action buttons per card: **Approve** · **Reject** · **View Full Profile**

On Reject: a dropdown to select a rejection reason (Nudity, Violence, Fake / Catfish, Not a Face, Underage Concern, Other). This reason is stored and visible to the moderator log.

Bulk action: checkbox-select multiple cards → **Approve All Selected** / **Reject All Selected**.

Keyboard shortcuts for speed: `A` = Approve, `R` = Reject, `→` = next card.

### 7.2 Verification Review

Separate sub-section within the moderation tab. Shows users whose `is_verified = false` and who have completed a `user_verification_sessions` flow with a non-failure status.

For each: show the verification selfie vs their profile photos. Admin can **Mark Verified** or **Reject Verification** (with reason).

---

## 8. Tab 5 — Reports Queue (`/reports`)

All rows from the `reports` table, with workflow status management.

### 8.1 Queue Table

Columns: `created_at` · `content_type` (PROFILE / STORY / CHAT) · `reason` · Reporter name (link) · Reported User name (link) · `status` (OPEN / UNDER_REVIEW / RESOLVED / DISMISSED)

Filters:

- Status (default: OPEN + UNDER_REVIEW)
- Content type
- Date range

Clicking a report opens a **Report Detail Drawer** (slides in from right):

**Report Detail Drawer contains:**

- Full report metadata (reporter, reported user, reason, `created_at`).
- If `content_type = STORY`: the story media rendered inline.
- If `content_type = CHAT`: link to open the chat thread (navigates to user detail → chat sub-tab).
- If `content_type = PROFILE`: reported user's profile photo and bio inline.
- Reported user's moderation history summary (warning count, past bans).
- Action buttons:
    - **Mark Under Review** → status = `UNDER_REVIEW`
    - **Dismiss Report** → status = `DISMISSED` (no action needed)
    - **Warn User** → issues a warning (same as Trust & Safety warning flow)
    - **Ban User** → hard ban (same flow)
    - **Remove Content** → removes the specific story/photo/message referenced
    - **Resolve** → marks report as `RESOLVED`

All actions write to `moderation_actions_log`.

---

## 9. Tab 6 — Revenue (`/revenue`)

For tracking monetisation health. Read-only analytics. SUPER_ADMIN only.

### 9.1 Summary Cards

- Total revenue (if `amount` in `user_purchases` is in INR/currency): show sum for selected time period.
- Premium subscriptions sold.
- Boosts sold.
- Comments packs sold.
- Chat unlocks sold.

Time filter (applies to all cards and charts): **7 days / 30 days / 6 months / 1 year / All Time**

### 9.2 Revenue Over Time Chart

Line chart of purchase events per day, with series breakdowns:

- Premium subscriptions (blue)
- Boosts (orange)
- Comment packs (purple)
- Chat unlocks (green)

### 9.3 Top Buyers Table

Paginated table of users sorted by total spend descending, for the selected time window: `User name` (link) · `Total purchases` · `Total spend` · `Premium status` · `Account state`

### 9.4 Pack Code Breakdown

Bar chart: which `pack_code` values are selling most (e.g. `BOOST_1` vs `BOOST_5` vs `BOOST_15`). Helps with pricing decisions.

### 9.5 Premium Plan Mix

Pie/donut chart: breakdown of active premium users by `premium_plan_code` (`PREMIUM_WEEK` / `PREMIUM_MONTH` / `PREMIUM_THREE_MONTHS`).

---

## 10. Tab 7 — Broadcast Notifications (`/notifications`)

Tool for sending global or targeted push notifications to users. SUPER_ADMIN only.

### 10.1 Compose Broadcast

A simple form:

- **Title** (notification title, max 50 chars, character counter).
- **Body** (notification body, max 150 chars, character counter).
- **Target Audience:**
    - All Users
    - Premium Users Only
    - Free Users Only
    - Users Active in Last 7 Days
    - Users in a specific city (text input for `living_in_city`)
- **Deep Link** (optional): a route within the app to open on tap (e.g. `dater://premium` or `dater://story-feed`).
- **Schedule:** Send Now vs Schedule for a specific datetime.

Preview panel on the right: renders a mock phone notification UI so the admin can see how it will appear.

**Send** button: requires a second confirmation dialog showing audience size estimate and the notification preview before final send.

### 10.2 Broadcast History

Table of all past broadcasts: `sent_at` · `title` · `body` · `target_audience` · `recipients_count` · `sent_by` (admin name)

---

## 11. Tab 8 — Settings (`/settings`)

SUPER_ADMIN only.

### 11.1 Admin User Management

Table of all admin accounts: `name` · `email` · `role` · `created_at` · `last_login_at` · `status` (active / suspended)

Actions: **Create New Admin** (email + role) · **Edit Role** · **Suspend** · **Delete**

New admin gets an email invite to set their password (do not set it for them).

### 11.2 Admin Audit Log

A read-only, reverse-chronological log of every action taken by any admin: `timestamp` · `admin name` · `action type` · `target user`(link) · `details`

This covers: logins, user bans, warnings, chat access events, photo approvals/rejections, broadcast sends.

This log is immutable — no admin can delete entries, including SUPER_ADMIN.

### 11.3 Platform Configuration (optional V2)

Placeholder section for future runtime config flags:

- Free tier daily profile view limit (currently ~20).
- Chat restriction message limit (currently 3).
- Onboarding step labels.

---

## 12. Admin API — Endpoints Needed (Backend Contract)

The following REST endpoints need to be built or extended in the Node.js backend to support the panel above. All routes are under `/admin/` prefix and require `Authorization: Bearer <admin_jwt>`.

### Auth

```
POST   /admin/auth/login
POST   /admin/auth/refresh
POST   /admin/auth/logout
```

### Dashboard

```
GET    /admin/dashboard/stats
       → { totalUsers, dau, mau, premiumCount, pendingReports, pendingPhotos, genderBreakdown, accountStateBreakdown, onboardingFunnel, verificationStats }

GET    /admin/dashboard/growth?window=30d
       → { data: [{ date, newUsers }] }

GET    /admin/dashboard/revenue?window=30d
       → { data: [{ date, boosts, comments, subscriptions, chatUnlocks }] }
```

### Users

```
GET    /admin/users?search=&state=&premium=&verified=&page=&limit=25&sort=
POST   /admin/users/:userId/warning          body: { reason, notes }
POST   /admin/users/:userId/shadowban        body: { reason }
POST   /admin/users/:userId/ban              body: { reason }
POST   /admin/users/:userId/unban
POST   /admin/users/:userId/pause            body: { until: ISO date }
POST   /admin/users/:userId/delete           body: { reason }
PATCH  /admin/users/:userId/profile          body: { field: value } (bio, name — limited fields)
POST   /admin/users/:userId/grant-premium    body: { plan_code, expires_at, reason }
POST   /admin/users/:userId/revoke-session/:sessionId
POST   /admin/users/:userId/verify           body: { reason }
```

### User Detail

```
GET    /admin/users/:userId/profile          → full users row + junction tables
GET    /admin/users/:userId/photos           → all user_photos rows (incl. pending/failed)
GET    /admin/users/:userId/filters          → user_filters + all filter_* tables
GET    /admin/users/:userId/verification     → verification selfie URL + session history
GET    /admin/users/:userId/trust            → account state, warnings, moderation_actions_log, reports against/by
GET    /admin/users/:userId/content          → active story + story history + story_interactions
GET    /admin/users/:userId/chat             → chat_threads list (SUPER_ADMIN only)
GET    /admin/users/:userId/chat/:threadId   → messages for a thread (SUPER_ADMIN only, logged)
GET    /admin/users/:userId/social           → friends, pending requests, notification_events, sessions, push tokens
GET    /admin/users/:userId/revenue          → purchases, wallets, boost activations, chat unlocks
```

### Photos

```
PATCH  /admin/photos/:photoId/approve
PATCH  /admin/photos/:photoId/reject         body: { reason }
DELETE /admin/photos/:photoId
GET    /admin/photos/queue?status=PENDING_MODERATION&page=&limit=
```

### Reports

```
GET    /admin/reports?status=OPEN&type=&page=
PATCH  /admin/reports/:reportId/status       body: { status: UNDER_REVIEW | RESOLVED | DISMISSED }
```

### Revenue

```
GET    /admin/revenue/summary?window=30d
GET    /admin/revenue/top-buyers?window=30d&page=
GET    /admin/revenue/pack-breakdown?window=30d
```

### Broadcast

```
POST   /admin/broadcast                      body: { title, body, audience, deepLink, scheduledAt }
GET    /admin/broadcast/history?page=
GET    /admin/broadcast/audience-size        body: { audience }   ← for the preview count
```

### Admin Management

```
GET    /admin/settings/admins
POST   /admin/settings/admins               body: { email, role }
PATCH  /admin/settings/admins/:adminId      body: { role, status }
GET    /admin/settings/audit-log?page=
```

**Critical bug fix required before launching:** The admin API currently references `is_banned` which was removed in migration 007. All admin endpoints must be updated to use `account_state = 'BANNED'` instead.

---

## 13. Additions Not in Original Requirements (Recommended)

These are gaps or additions worth building from day one:


    
6. **Onboarding Funnel Chart** (section 4.6) — tells you where new users drop off during signup. Critical for growth.
 
    
10. **Soft-delete visibility** — show soft-deleted photos and messages in admin views (with a `[deleted]` visual treatment). They're retained in DB, admins should be able to see them for moderation.
    

---

