

Admin panel needs
See a users all details - their time etc of creation like all things we are storing for a user 
then their chat threads we can read to actually moderate
their selfie we have saved thru which verification occurs , their story current one 
their friends , notifications etc 
to see if they have any reports warning or bans 
ability to report user give user a warning or ban user and unban etc also 
general info about the platform also number of users active current users etc these types of standard stats 
ability to see premium users boosts/comments etc bought in 7 days 30 days 6 months year etc 
if anything left tell me 




Your list is incredibly solid for an MVP admin panel. It covers the three pillars of operating a dating app: **CRM (Customer Relationship Management), Moderation, and Revenue Tracking.**

Because we want to keep this _lean_ so you aren't spending months building internal tools instead of growing the user base, we need to organize these features logically.

Here is a structured breakdown of everything you mentioned, plus a few **critical additions** that are highly specific to the Dater app architecture (especially concerning your AWS Rekognition and MSG91 setups) that you shouldn't overlook.

### 1. The Global Dashboard (Stats & Health)

_Your command center. Keep this to read-only metrics so it loads instantly._

- **User Stats:** Total registered, Daily Active Users (DAU), Monthly Active Users (MAU), and ratio of male/female/other profiles.
    
- **Revenue/Premium Stats:** Premium user count, Boosts purchased, and Extra Comments bought segmented by time filters (7d, 30d, 6m, 1y, All Time).
    
    

### 2. User Management (The CRM)

_The detailed view for a specific user._

- **Deep Search:**  - You need a way to actually _find_ the user. A search bar that takes Phone Number (since you use MSG91), User ID, or exact Name.
    
- **Core Profile:** Name, age, gender, dating preferences, prompts, location data, and exact timestamp of creation etc (all user profile related fields city etc also.
    
- **Social Graph:** Their friends list and active notifications.
    
- **Verification Status:** View their raw verification selfie side-by-side with their live profile photos.
    
- ** - Edit/Impersonation:** The ability for an admin to force-update a user's bio or delete a specific photo without banning the whole account.
    

### 3. Trust & Safety (Content & Moderation)

_Where you handle bad actors. This is the highest liability area of a dating app._

- **Action Controls:** Buttons to Issue Warning, Shadowban (they can swipe but nobody sees them), Hard Ban, and Unban.
    
- **Record of Offenses:** A timeline log of how many reports they have received, who reported them, and past warnings.
    
- **Current Content:** View their active Story and their live media gallery.
    

    
- **MISSING - Privacy-Safe Chat Moderation:** You mentioned reading chat threads. 
    

### 4. Global Operations

_Tools to manage the platform at large._

- **MISSING - Broadcast Push Notifications:** An admin tool to send a global push notification to all users (e.g., "Happy Valentine's Day! Premium is 50% off today" or "Server maintenance in 1 hour").
    



### 1. The Core Framework: Vite + React (or Next.js)

- **Vite + React (Leanest Option):** For a strictly internal, auth-gated dashboard where SEO does not matter, a Vite-powered React Single Page Application (SPA) is the fastest way to build. It compiles instantly and keeps the architecture dead simple.
    
- **Next.js (Workflow Option):** Stepping into a Next.js environment is incredibly solid if you prefer utilizing the App Router and file-based routing workflow. You can just build it as a static export or standard client-side app, since server-side rendering isn't strictly necessary for internal tools.
    

### 2. The UI Library: shadcn/ui + Tailwind CSS

To perfectly execute that minimalist, understated aesthetic without fighting bloated material design templates, **shadcn/ui**is the industry standard right now.

- **Why it works for you:** It gives you pre-built, highly customizable data tables, pagination, dialogs, and form inputs.
    
- **Total Control:** Unlike typical component libraries, shadcn copies the actual component code into your project. This means you can easily enforce the exact border radii, font hierarchies, and muted color palettes we just extracted from your Kotlin app to ensure absolute visual consistency.
    

### 3. Data Management: TanStack Query (React Query)

Your admin panel will be constantly pulling live data—user lists, moderation queues, revenue stats, and MSG91 logs—from your Node.js API. React Query handles the caching, background fetching, and loading states automatically. It will save you from writing hundreds of lines of complex state management and makes building paginated data tables a breeze.

### 4. Admin Framework Shortcut: Refine.dev (Optional)

If you want to skip wiring up the React Query and table logic yourself, look into **Refine**. It is a headless React framework specifically built for admin panels. It connects directly to your Node.js REST API and handles all the CRUD operations, routing, and table pagination out of the box, while still letting you use Tailwind and shadcn/ui for the visuals.

This stack ensures you aren't wasting time reinventing the wheel on internal tools, letting you focus on the core mobile products.