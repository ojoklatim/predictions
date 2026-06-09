# Prediction System App — Complete Build Prompts
## Admin Dashboard + Landing Page

> **How to use these prompts:** Each section is a self-contained prompt. Feed them sequentially to your AI coding agent (Claude, Gemini CLI, Cursor). Every prompt references the design tokens established in Section 0, so read that first and keep it in context.

---

## DESIGN REFERENCE (Read before using any prompt below)

The admin dashboard uses this established design language — all generated code must respect it:

**Color tokens:**
- `--primary: #0057B8` (blue — brand primary, sidebar, buttons)
- `--primary-dark: #003F8A` (dark blue — hover states)
- `--gold: #FFD700` (active nav indicator, Gold tier badge)
- `--surface: #F5F7FA` (page background)
- `--card: #fff` (card/surface background)
- `--text: #0A0A0A` (primary text)
- `--muted: #6B7280` (secondary text)
- `--divider: #E5E7EB` (borders, dividers)
- `--green: #16a34a` (success, revenue positive)
- `--red: #dc2626` (live indicator, danger, flagged)
- `--orange: #EA580C` (warnings)

**Layout:** 220px fixed sidebar + fluid main. Cards with `0.5px` borders, `var(--border-radius-lg)` corners. Tables: `12px` font, `0.5px` bottom borders per row.

**Nav sections:** Overview (Dashboard, Analytics) → Competition (Matches, Predictions, Leaderboard, Bracket) → Users (All Users, Payments) → Settings (Configuration, Notifications)

**Icon library:** Tabler Icons (`ti ti-*` class names)

**Status badges:**
- Live: red bg `#fee2e2`, text `#991b1b`
- Upcoming: blue bg `#dbeafe`, text `#1e40af`
- Finished: green bg `#f0fdf4`, text `#166534`
- Gold tier: yellow bg `#fef9c3`, text `#713f12`

---

# PART A — ADMIN DASHBOARD

---

## SECTION 1 — Project Scaffold & Layout Shell

```
You are building the admin dashboard for a World Cup Prediction System app.

Set up the base layout shell that all dashboard pages will share.

TECH STACK: [insert your stack — e.g. Next.js 14 App Router / React + Vite / plain HTML+CSS]

REQUIREMENTS:

1. Create a persistent sidebar (220px wide) with the following structure:
   - Logo area: trophy emoji 🏆, app name "Prediction System", version "Admin Panel · v1.0"
   - Navigation grouped into sections:
     * Overview: Dashboard, Analytics
     * Competition: Matches, Predictions, Leaderboard, Bracket
     * Users: All Users, Payments
     * Settings: Configuration, Notifications
   - Footer pill: admin avatar initials, name "Admin", role "Super Admin", logout icon
   - Background: #0057B8. Active nav item: white bg at 15% opacity + #FFD700 left border + white text. Inactive: rgba(255,255,255,0.75) text.

2. Top bar (inside main area):
   - Page title (left)
   - Search input (center-right): "Search…" placeholder with search icon, 200px wide
   - Primary action button (right): "+ Add match" in #0057B8

3. Main content area: scrollable, background #F5F7FA, padding 20px 24px

4. Use Tabler Icons (CDN: https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css) for all icons using class `ti ti-[name]`.

5. All cards: white background, 0.5px border using --divider color, border-radius from design system, padding 16px.

6. The layout must be responsive — on mobile (<768px) the sidebar collapses to a hamburger menu.

Use CSS custom properties for all color, spacing, and radius tokens as listed in the design reference above. Do not hardcode color hex values in component styles.

Output: the layout wrapper component/template that wraps every admin page.
```

---

## SECTION 2 — Stats Overview Row (KPI Cards)

```
Build the 4-card KPI stats row for the admin dashboard overview page.

This row sits at the top of the main content area, below the topbar.

CARD DEFINITIONS (left to right):

1. Total Users
   - Icon: ti ti-users
   - Value: dynamic (from API / prop)
   - Delta: "↑ 12% this week" — green arrow text

2. Total Predictions
   - Icon: ti ti-chart-arrows
   - Value: dynamic
   - Delta: "↑ 34% today" — green arrow text

3. Revenue (€)
   - Icon: ti ti-coin
   - Value: dynamic (formatted as integer, e.g. 3,847)
   - Delta: "↑ €1 / entry" — green

4. Live Matches Now
   - Icon: ti ti-ball-football
   - Value: dynamic (count of currently live matches)
   - Delta: "● Live matches" — red pulsing dot

IMPLEMENTATION:

- Grid: 4 equal columns, 12px gap
- Each card: white bg, 0.5px border, rounded corners, 14px 16px padding
- Stat label: 11px, --muted color, flex row with icon (14px)
- Stat value: 24px, font-weight 500, line-height 1
- Delta: 11px, --muted color, with colored span for direction

- The "Live" delta dot should pulse using a CSS animation:
  @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }

- Accept stats as props (React) or render from an API call to GET /api/admin/stats which returns:
  { totalUsers, totalPredictions, totalRevenue, liveMatchCount, deltas: { users, predictions } }

Output: StatCard component + StatGrid layout wrapper.
```

---

## SECTION 3 — Match Management Table

```
Build the Match Management card for the admin dashboard.

This is the main table on the left side of the dashboard (spans 2/3 of the content width).

FEATURES:

1. Card header:
   - Title: "Match management"
   - Buttons: "Filter" (ghost) + "+ New" (primary, #0057B8)

2. Tab filter bar (pill-style):
   - Tabs: All | Live | Upcoming | Finished
   - Active tab: white bg, shadow, primary text
   - Inactive: transparent, muted text
   - Clicking a tab filters the table rows below

3. Table columns: Match | Stage | Status | Score | Entries | Actions

4. Match cell: flag emoji + team name + "vs" divider + flag emoji + team name
   Example: 🇧🇷 Brazil vs 🇦🇷 Argentina

5. Status badge:
   - Live: red bg (#fee2e2), text (#991b1b), dot + minute (e.g. "67'")
   - Upcoming: blue bg (#dbeafe), text (#1e40af), dot + time (e.g. "18:00")
   - Finished: green bg (#f0fdf4), text (#166534), dot + "FT"

6. Score pill:
   - Active score: #0057B8 bg, white text, e.g. "2 – 1"
   - No score yet: gray bg, muted text, "– : –"

7. Entries cell: mini progress bar (60px wide, 4px tall) + numeric count
   Bar fill = (entries / maxEntries * 100)%

8. Actions cell: Edit button (icon only: ti ti-edit) + Delete button (icon, red color)

9. Row hover: light bg (#F5F7FA)

DATA CONTRACT — fetch from GET /api/admin/matches?status=all|live|upcoming|finished
Response: Array of:
{
  id, homeTeam: { name, flag }, awayTeam: { name, flag },
  stage, status: "live"|"upcoming"|"finished",
  minute?: number, kickoffTime?: string,
  score?: { home: number, away: number },
  entryCount: number, maxEntries: number
}

ACTIONS:
- Edit button: opens an EditMatchModal (scaffold the modal shell, implementation in next section)
- Delete button: shows a confirm dialog, calls DELETE /api/admin/matches/:id, refreshes list

Output: MatchTable component with tab filtering, data fetching, and action handlers.
```

---

## SECTION 4 — Add / Edit Match Modal

```
Build the Add Match and Edit Match modal for the admin dashboard.

This modal is triggered by "+ New" (empty form) or the edit icon on a match row (pre-filled).

MODAL FIELDS:

1. Home Team
   - Text input: team name
   - Emoji picker or text input: flag emoji (e.g. 🇧🇷)

2. Away Team
   - Same as home team

3. Stage / Group
   - Select: Group A, Group B, Group C, Group D, Group E, Group F, Group G, Group H, Round of 16, Quarter-final, Semi-final, Third Place, Final

4. Kickoff Date & Time
   - Date picker + time picker (or datetime-local input)

5. Status
   - Select: Upcoming | Live | Finished

6. Score (shown only when status = Live or Finished)
   - Two number inputs side by side: Home score | Away score

7. Entry Fee (€)
   - Number input, default 1.00

8. Prediction Deadline
   - datetime-local input (must be before kickoff)

VALIDATION:
- All fields required (except score when status = Upcoming)
- Deadline must be before kickoff time
- Show inline field-level errors in red below each invalid input

API:
- Create: POST /api/admin/matches (body: all fields)
- Edit: PUT /api/admin/matches/:id (body: changed fields)
- On success: close modal, show toast "Match saved", refresh match list

DESIGN:
- Modal overlay: rgba(0,0,0,0.4)
- Modal panel: white, 480px max-width, rounded corners, 24px padding
- Header: title + X close button
- Footer: Cancel (ghost) + Save Changes (primary #0057B8)
- Inputs: 12px font, 0.5px border, 6px radius, 8px 12px padding

Output: MatchModal component (works for both create and edit via a mode prop).
```

---

## SECTION 5 — Leaderboard Table

```
Build the Top Users Predictions Leaderboard card for the admin dashboard.

This card sits below the Match Management table (left column, full width).

LAYOUT:
- Card header: "Top users — predictions leaderboard" + "View all" ghost button
- Table columns: # | User | Points | Predictions | Exact | Level

TABLE ROW DETAILS:

1. Rank column: zero-padded rank number (01, 02, 03...), 11px, muted color
2. User cell: colored avatar circle with initials (2 letters) + full name
   - Avatar colors are deterministic based on user ID (use a palette of 6–8 colors)
3. Points: bold number
4. Predictions: total count
5. Exact: exact score predictions count
6. Level badge:
   - Gold tier (rank 1–2): yellow bg #fef9c3, text #713f12, "🥇 Gold"
   - Silver tier (rank 3–5): blue bg #dbeafe, text #1e40af, "Silver"
   - Bronze tier (rank 6+): gray bg, "Bronze"

DATA: fetch from GET /api/admin/leaderboard?limit=5
Response: Array of { rank, userId, name, initials, points, totalPredictions, exactScores, tier }

INTERACTIVITY:
- "View all" button navigates to the full /admin/leaderboard page
- Clicking a user row opens a UserDetailModal (scaffold only — see Section 7)

Output: LeaderboardTable component.
```

---

## SECTION 6 — Right Sidebar Widgets (3 stacked cards)

```
Build the three stacked right-column cards for the admin dashboard overview.

These cards occupy the right 1/3 of the main content area.

--- CARD 1: Prediction Accuracy ---

1. Progress bars (3 rows):
   - "Exact score" — blue (#0057B8), dynamic %
   - "Correct winner" — light blue (#3b82f6), dynamic %
   - "Wrong result" — gray (#e5e7eb), dynamic %
   - Each row: label (90px fixed width) + flex bar + percentage value

2. Divider line

3. Line chart (Chart.js, 130px tall):
   - X-axis: 7-day labels (Mon–Sun or last 7 dates)
   - Y-axis: prediction count (formatted as "4.2k")
   - Line: #0057B8, fill with rgba(0,87,184,0.08), tension 0.4
   - No legend. Grid lines only on Y axis, very faint.

DATA: GET /api/admin/analytics/predictions
Response: {
  accuracy: { exact: number, correctWinner: number, wrong: number },
  dailyCounts: [{ label: string, count: number }] // 7 items
}

--- CARD 2: Revenue Snapshot ---

Rows (label + value, separated by 0.5px dividers):
- Total entries: count
- Entry fee: €1.00
- Total raised: €X.XX (green text #16a34a)
- Prize pool (est.): €X.XX (blue text #0057B8) — calculated as 80% of total raised
- Platform fee: €X.XX — calculated as 20% of total raised

Footer: "Export CSV" button (full width, ghost style, download icon ti ti-download)
- Clicking calls GET /api/admin/revenue/export and triggers file download

DATA: GET /api/admin/revenue/snapshot
Response: { totalEntries, entryFee, totalRaised, prizePool, platformFee }

--- CARD 3: Recent Activity Feed ---

Title: "Recent activity"

Activity items (most recent first, show last 10):
- Each item: colored icon square + activity text + relative timestamp ("2 min ago")
- Icon colors:
  * Green (payment): ti ti-coin — bg #dcfce7, color #166534
  * Blue (prediction): ti ti-chart-arrows — bg #dbeafe, color #1e40af
  * Amber (match update): ti ti-ball-football — bg #fef3c7, color #92400e
  * Blue (new user): ti ti-user-plus — bg #dbeafe, color #1e40af
  * Red (alert/flag): ti ti-alert-triangle — bg #fee2e2, color #991b1b

Polling: refresh every 30 seconds (setInterval or React Query refetchInterval)

DATA: GET /api/admin/activity?limit=10
Response: Array of { id, type: "payment"|"prediction"|"match_update"|"new_user"|"alert", text, timestamp }

Output: Three components — PredictionAccuracyCard, RevenueSnapshotCard, ActivityFeedCard — composed in a RightSidebarWidgets wrapper.
```

---

## SECTION 7 — Users Management Page

```
Build the full Users Management page at /admin/users.

PAGE LAYOUT:
- Page title: "All Users"
- Top bar actions: search input + "Export" button + "Invite user" button

FILTERS BAR (below topbar, above table):
- Filter pills: All | Active | Inactive | Suspended
- Sort dropdown: Newest first | Most predictions | Highest score | Alphabetical

USERS TABLE columns:
# | User | Email | Joined | Predictions | Points | Status | Actions

COLUMN DETAILS:
1. Rank: sequential row number
2. User: avatar (colored initials circle) + full name
3. Email: truncated if long, click to copy
4. Joined: formatted date (e.g. "14 Jun 2024")
5. Predictions: total prediction count
6. Points: current leaderboard points
7. Status badge:
   - Active: green bg, "Active"
   - Inactive: gray bg, "Inactive"
   - Suspended: red bg, "Suspended"
8. Actions: "View" button (opens UserDetailModal) + kebab menu (⋮) with: Edit, Suspend, Delete

USER DETAIL MODAL (triggered by View or row click):
- Header: avatar + name + email + status badge
- Tabs: Overview | Predictions | Payments
  * Overview: joined date, total predictions, exact scores, points, tier
  * Predictions tab: table of all predictions made (match, predicted score, actual score, points earned)
  * Payments tab: list of payment transactions

PAGINATION: page controls at bottom — Previous | 1 2 3 … | Next, showing "Showing 1–20 of 3,847"

DATA:
- GET /api/admin/users?page=1&limit=20&status=all&sort=newest&q=searchterm
- Response: { users: [...], total, page, pageSize }
- User object: { id, name, initials, email, joinedAt, totalPredictions, points, tier, status }

BULK ACTIONS:
- Checkbox on each row + header "select all"
- When rows selected: bulk action bar appears: "Suspend selected" | "Export selected" | "Delete selected"

Output: UsersPage component + UserDetailModal component.
```

---

## SECTION 8 — Payments Page

```
Build the Payments admin page at /admin/payments.

PAGE TITLE: "Payments"

SUMMARY CARDS (top row, 3 cards):
1. Total Revenue: €X,XXX — green up arrow + % change
2. Pending Payments: count — amber dot
3. Flagged for Review: count — red dot, link to filtered view

FILTERS:
- Date range picker (From / To)
- Status filter: All | Completed | Pending | Flagged | Refunded
- Search by user name or transaction ID

PAYMENTS TABLE columns:
Transaction ID | User | Match | Amount | Date | Method | Status | Actions

COLUMN DETAILS:
1. Transaction ID: monospace font, truncated with copy button
2. User: avatar + name, click opens UserDetailModal
3. Match: home team vs away team (short format)
4. Amount: €1.00 (or custom amount)
5. Date: formatted "14 Jun 2024, 14:32"
6. Method: "Card", "PayPal", "M-Pesa", etc.
7. Status badge: Completed (green) | Pending (blue) | Flagged (red) | Refunded (gray)
8. Actions: "View receipt" + flag/unflag toggle

FLAGGED PAYMENT DETAIL:
- Clicking "View receipt" opens a modal with: transaction breakdown, user info, IP address, reason for flag (if any), and action buttons: "Clear flag", "Refund", "Ban user"

EXPORT:
- "Export CSV" button in top right that calls GET /api/admin/payments/export?from=&to=&status=

DATA: GET /api/admin/payments?page=1&limit=20&status=all&from=&to=&q=
Response: { payments: [...], total, summary: { totalRevenue, pendingCount, flaggedCount } }

Output: PaymentsPage component + PaymentDetailModal.
```

---

## SECTION 9 — Predictions Management Page

```
Build the Predictions admin page at /admin/predictions.

PURPOSE: Admins can view all predictions made by all users, filter by match, review accuracy after scores are entered, and manually adjudicate disputes.

PAGE LAYOUT:
- Title: "Predictions"
- Stats row (3 cards): Total predictions submitted | Pending scoring | Disputes raised

FILTERS:
- Match selector dropdown (search by team name or stage)
- Status: All | Pending | Scored | Disputed
- Date range

TABLE columns:
User | Match | Predicted Score | Actual Score | Points Awarded | Status | Submitted At | Actions

STATUS VALUES:
- Pending: match not yet played — blue badge
- Scored: points have been calculated — green badge
- Disputed: user raised a dispute — amber badge
- Void: prediction voided by admin — gray badge

SCORING LOGIC (display only — admin reference):
- Exact score: 3 points
- Correct result (win/draw/loss): 1 point
- Wrong: 0 points

DISPUTE RESOLUTION:
- "Disputed" rows have a "Review" action button
- Opens DisputeModal: shows user's claim, original prediction, actual score, admin notes textarea
- Actions: "Uphold prediction (award points)", "Dismiss dispute", "Void prediction"
- All actions call PATCH /api/admin/predictions/:id/dispute with { resolution, adminNote }

DATA: GET /api/admin/predictions?page=1&limit=50&matchId=&status=all
Response: { predictions: [...], total }
Each prediction: { id, user: {name, avatar}, match: {home, away, stage}, predictedHome, predictedAway, actualHome, actualAway, points, status, submittedAt }

Output: PredictionsPage component + DisputeModal component.
```

---

## SECTION 10 — Analytics Page

```
Build the Analytics page at /admin/analytics.

This page gives the admin a deeper view of platform health beyond the dashboard overview.

PAGE LAYOUT:
- Title: "Analytics"
- Date range selector: Last 7 days | Last 30 days | This tournament | Custom range

CHART SECTION 1 — User Growth (full width):
- Line chart (Chart.js): cumulative user registrations over time
- Two lines: "Total users" (#0057B8) and "Active users" (#16a34a)
- X-axis: dates. Y-axis: user count.

CHART SECTION 2 — Predictions per Match (half width):
- Horizontal bar chart: top 10 matches by prediction volume
- Bar color: #0057B8
- Labels: "🇧🇷 Brazil vs 🇦🇷 Argentina (Group A)"

CHART SECTION 3 — Revenue Over Time (half width):
- Area chart: daily revenue (€)
- Fill: rgba(0,87,184,0.12)

STATS GRID (4 stat cards below charts):
- Avg predictions per user
- Prediction accuracy rate (%)
- Most predicted match (name)
- Peak activity hour (e.g. "19:00–20:00")

LEADERBOARD ACCURACY TABLE:
- Top 20 users ranked by prediction accuracy %
- Columns: Rank | User | Accuracy % | Exact Scores | Total Predictions | Points

DATA: GET /api/admin/analytics?range=7d|30d|tournament|custom&from=&to=
Response: {
  userGrowth: [{ date, total, active }],
  predictionsByMatch: [{ match, count }],
  revenueOverTime: [{ date, amount }],
  summary: { avgPredictionsPerUser, accuracyRate, mostPredictedMatch, peakHour },
  leaderboardAccuracy: [{ rank, user, accuracy, exactScores, total, points }]
}

All charts must be responsive and respect prefers-reduced-motion.

Output: AnalyticsPage component with all charts and data tables.
```

---

## SECTION 11 — Configuration & Settings Page

```
Build the Configuration page at /admin/settings.

This page has two columns. Left: navigation menu of settings categories. Right: settings panel for the active category.

SETTINGS CATEGORIES (left nav):

1. Tournament Setup
2. Scoring Rules
3. Entry & Payments
4. Notifications
5. Access & Security

--- PANEL 1: Tournament Setup ---
- Tournament name (text input)
- Tournament year (number)
- Start date / End date (date pickers)
- Total teams (number, default 32)
- Stages (checklist: Group Stage, Round of 16, Quarter-finals, Semi-finals, Final)
- Banner image upload

--- PANEL 2: Scoring Rules ---
- Exact score prediction points (number input, default 3)
- Correct result points (number input, default 1)
- Wrong prediction points (number input, default 0)
- Bonus: correct finalist prediction (number, default 5)
- Bonus: correct champion prediction (number, default 10)
- Toggle: "Allow predictions after match starts" (dangerous — red warning if enabled)

--- PANEL 3: Entry & Payments ---
- Entry fee (€) — number input
- Payment methods (checklist): Card | PayPal | M-Pesa | Bank Transfer
- Prize pool split (%): winner | top 3 | top 10 | platform — must total 100%
- Minimum withdrawal amount (€)
- Auto-distribution toggle: distribute prizes automatically when tournament ends

--- PANEL 4: Notifications ---
- Email notifications: New user signup | Payment received | Match started | Match scored
- In-app notifications: same options
- SMS alerts (for flagged payments): toggle + phone number for admin

--- PANEL 5: Access & Security ---
- Admin accounts table: name, email, role, last login, actions (edit, remove)
- "Add admin" button → inline form
- 2FA status: toggle per account
- Session timeout: dropdown (15 min | 30 min | 1 hour | 4 hours | Never)
- API keys: list + "Regenerate" button

SAVE behavior:
- Each panel has a "Save changes" primary button
- Changes call PATCH /api/admin/settings/:category
- Show success toast on save

Output: SettingsPage component with left nav + dynamic right panel.
```

---

## SECTION 12 — Bracket / Tournament Tree Page

```
Build the Tournament Bracket page at /admin/bracket.

This is a visual bracket showing match progression from Group Stage through to the Final.

LAYOUT:
- Full-width canvas/SVG bracket visualization
- Reads from bracket data and renders boxes connected by lines

BRACKET STRUCTURE:
- Round of 16 (8 matches, left side): 4 on left column, 4 on right column
- Quarter-finals (4 matches): 2 per side
- Semi-finals (2 matches): 1 per side
- Final (1 match): center

Each match box shows:
- Home team: flag + name + score (or "?")
- Away team: flag + name + score (or "?")
- Stage label below (e.g. "QF1")
- Status badge: Upcoming / Live / Finished (same styling as dashboard)

INTERACTIVITY:
- Hover on a match box: shows tooltip with kickoff time, entries count, prediction split
- Click on a match box: opens match detail modal (reuse MatchModal from Section 4)
- Admin can update scores directly from this view

RENDERING:
- Use SVG for the connecting lines between rounds
- Use HTML/CSS for the match boxes (easier to style)
- Mix: HTML boxes with an SVG overlay for the bracket lines

COLORS:
- Finished: green border on box
- Live: red border + pulsing animation
- Upcoming: default border

DATA: GET /api/admin/bracket
Response: {
  rounds: [
    {
      name: "Round of 16",
      matches: [{ id, position, homeTeam, awayTeam, score, status, kickoffTime }]
    },
    ...
  ]
}

Output: BracketPage component. Use a clean SVG+HTML hybrid approach — no third-party bracket libraries.
```

---

# PART B — LANDING PAGE

---

## SECTION 13 — Landing Page: Hero Section

```
Build the hero section of the public-facing landing page for the World Cup Prediction System.

DESIGN DIRECTION:
- Dark background: #0A0F1C (deep navy, almost black)
- Primary accent: #0057B8 (brand blue) with gold highlights #FFD700
- Typography: use "Clash Display" or "Space Grotesk" for headings (Google Fonts), system sans for body
- The hero must feel premium, stadium-energy — not generic SaaS

CONTENT:

Left column (60% width):
- Eyebrow label: small caps, gold color — "⚽ WORLD CUP 2026"
- Headline (large, bold):
  "Predict. Compete.
   Win the Cup."
  — "Win the Cup" in #0057B8 or gradient from #0057B8 to #FFD700
- Subheadline (18px, muted gray):
  "Enter for just €1. Predict match scores, climb the leaderboard, and win real cash prizes. The ultimate fan challenge."
- CTA buttons:
  - Primary: "Enter Now — €1" (#0057B8 bg, white text, slightly pill-shaped)
  - Secondary: "See how it works" (ghost, white border)
- Social proof strip below CTAs:
  "3,847 players entered · €3,847 prize pool · 28,412 predictions made"
  Icons: ti ti-users, ti ti-trophy, ti ti-chart-arrows (each stat inline)

Right column (40% width):
- A stylized "match card" UI preview showing a live match in progress:
  - 🇧🇷 Brazil 2 – 1 🇦🇷 Argentina
  - Stage: Group A · 67'
  - "Your prediction: 2 – 1 ✓ Correct!"
  - Points badge: +3 pts
  - Card has dark surface bg, blue glow/shadow border
  - Subtle floating animation (CSS keyframe, up/down 8px, 3s loop)

BACKGROUND:
- Deep navy #0A0F1C
- Subtle radial gradient glow from center-right in #0057B8 at 8% opacity
- Faint stadium grass texture overlay (CSS background pattern: repeating diagonal lines at low opacity) OR a pitch line pattern using CSS gradients

RESPONSIVE:
- On mobile: stack columns, right column hides the match card (shows just the stats)

Output: HeroSection component.
```

---

## SECTION 14 — Landing Page: How It Works Section

```
Build the "How It Works" section of the landing page.

This section explains the 4-step process to a new visitor.

DESIGN:
- Background: white (#fff) or very light gray (#F5F7FA)
- Section heading: "How it works" — left-aligned, 32px, dark
- Subheading: "Simple. Fast. Exciting." — muted, 16px
- Steps laid out in a horizontal row (4 columns) on desktop, 2x2 on tablet, stacked on mobile

STEP DEFINITIONS:

Step 1 — Sign Up
- Icon: ti ti-user-plus (in a blue circle badge, #0057B8 bg, white icon)
- Title: "Create your account"
- Description: "Register in seconds. No complicated forms — just your name, email, and you're in."

Step 2 — Pay Entry Fee
- Icon: ti ti-coin (gold #FFD700 bg, dark icon)
- Title: "Pay the €1 entry fee"
- Description: "A single €1 fee unlocks the full tournament. Card, PayPal, or mobile money accepted."

Step 3 — Make Predictions
- Icon: ti ti-chart-arrows (#0057B8)
- Title: "Predict every match"
- Description: "Pick the exact scoreline for each match before kickoff. Exact scores earn 3 points, correct results earn 1."

Step 4 — Win Prizes
- Icon: ti ti-trophy (gold)
- Title: "Top the leaderboard, win cash"
- Description: "80% of the prize pool goes to the top predictors. The champion takes home the biggest share."

CONNECTING ELEMENT:
- A dashed horizontal line connecting the 4 steps (desktop only)
- The line is #0057B8 at 30% opacity, dotted stroke style

SCORING CALLOUT (below steps):
- A small highlighted box: "Scoring: Exact score = 3pts · Correct result = 1pt · Wrong = 0pts"
- Style: blue bg at 8% (#0057B8), blue border, blue text, rounded, centered

Output: HowItWorksSection component.
```

---

## SECTION 15 — Landing Page: Live Matches & Leaderboard Preview

```
Build the "Live Now" social proof section of the landing page.

PURPOSE: Show visitors live match action and the leaderboard to create urgency and excitement.

LAYOUT: Two columns, 55/45 split.

--- LEFT COLUMN: Live Matches ---

Header: "🔴 Live Now" (title) + "4 matches in progress" (muted)

Match cards (show 3 cards):
Each card:
- Dark surface bg (#0A1929), rounded, slight blue border glow
- Flag + team name vs flag + team name
- Live score in large bold (e.g. "2 – 1")
- Stage badge (e.g. "Group A") + minute badge ("67'", pulsing red dot)
- Prediction split: small bar showing % of users who predicted each outcome
  Example: "Brazil win — 58% | Draw — 22% | Argentina win — 20%"
  (Three segments, colored: blue | gray | red)

"View all matches →" link at bottom

--- RIGHT COLUMN: Leaderboard Preview ---

Header: "🏆 Top Predictors"

Leaderboard rows (show top 5):
Each row:
- Rank number (large, bold, gold for #1)
- Colored avatar (initials)
- Name + country flag emoji
- Points (large, blue)
- A subtle "crown" emoji 👑 on rank 1

"See full leaderboard →" link

CTA Banner (below both columns, full width):
- Background: gradient #0057B8 → #003F8A
- Text: "Think you can beat them? Enter now for €1." — white, centered
- Button: "Join the Challenge" — gold #FFD700 bg, dark text

DATA NOTE: In the final implementation, fetch from:
- GET /api/public/live-matches (returns live match data)
- GET /api/public/leaderboard?limit=5

For the static landing page version, use realistic placeholder data.

Output: LivePreviewSection component.
```

---

## SECTION 16 — Landing Page: Prizes & FAQ Section

```
Build the Prizes and FAQ section of the landing page.

--- PRIZES SECTION ---

Header: "What you can win"
Subheader: "80% of the total entry pool goes directly to top predictors."

Prize tier cards (horizontal row):

🥇 1st Place
- "~€2,500"
- "Based on 3,847 current entries"
- Gold border, gold crown icon

🥈 2nd Place
- "~€750"
- Silver border

🥉 3rd Place
- "~€385"
- Bronze border

Prize pool breakdown bar:
- A horizontal stacked bar showing: 1st (50%) | 2nd (20%) | 3rd (10%) | 4th–10th (20%)
- Each segment labeled and color-coded

Fine print note: "Final prize amounts depend on total entries. More entries = bigger prizes."

Dynamic counter CTA:
- "Current prize pool: €3,847" — updates as more people enter
- "Every new entry adds €0.80 to the pool" — small italic note

--- FAQ SECTION ---

Header: "Common questions"

Use an accordion (expand/collapse) for each question:

Q1: "When can I submit predictions?"
A: Before each match kicks off. Once a match goes live, that prediction locks. You can still predict future matches.

Q2: "How are points calculated?"
A: Exact score = 3 points. Correct result (right win/draw/loss but wrong score) = 1 point. Wrong result = 0 points.

Q3: "How do I get paid if I win?"
A: We pay out via bank transfer, PayPal, or mobile money within 7 days of the tournament final.

Q4: "Can I enter as a group or syndicate?"
A: Each account is individual, but you can share your referral link and compete against friends on the same leaderboard.

Q5: "What happens if a match is abandoned or postponed?"
A: Predictions for that match are voided and no points are awarded or deducted.

Q6: "Is this legal in my country?"
A: Prediction games are subject to local regulations. Please check your local laws before entering.

DESIGN:
- FAQ items: clean accordion, chevron icon rotates on open
- Prizes section: subtle radial glow in gold behind the 1st place card

Output: PrizesSection + FAQSection components.
```

---

## SECTION 17 — Landing Page: Footer & Nav

```
Build the full public navigation header and site footer for the landing page.

--- NAVIGATION HEADER ---

Left: Logo — trophy emoji 🏆 + "Prediction System" in bold + "World Cup 2026" in small gold text below

Center links: How it works | Leaderboard | Prizes | FAQ

Right:
- "Log in" ghost button
- "Enter Now — €1" primary button (#0057B8 bg)

Behavior:
- Sticky on scroll: adds white background + drop shadow when scrolled > 80px
- Mobile: hamburger menu (≡ icon), full-screen drawer with the same links + CTAs

--- FOOTER ---

Background: #0A0F1C (dark navy, matches hero)

Layout (3 columns):

Column 1 — Brand:
- Logo + tagline: "The ultimate World Cup prediction challenge."
- Social icons: Twitter/X, Instagram, Facebook (Tabler icon versions)

Column 2 — Quick links:
- How it works
- Leaderboard
- Prize structure
- Terms & Conditions
- Privacy Policy

Column 3 — Contact:
- support@predictionsystem.com
- "Join our Discord" link
- Newsletter signup: email input + "Notify me" button

Bottom bar (full width, thin divider above):
- "© 2026 Prediction System. All rights reserved."
- Responsible gaming note: "Play responsibly. For entertainment purposes only."

DESIGN:
- Footer text: rgba(255,255,255,0.6) for secondary links, white for primary
- Link hover: #0057B8 or #FFD700
- Newsletter input: dark input with blue focus ring

Output: SiteHeader (with sticky scroll behavior) + SiteFooter components.
```

---

## SECTION 18 — Landing Page: Full Assembly & SEO

```
Assemble all landing page sections into a single page and add SEO + performance configuration.

SECTION ORDER:
1. SiteHeader (sticky)
2. HeroSection
3. HowItWorksSection
4. LivePreviewSection
5. PrizesSection
6. FAQSection
7. SiteFooter

SCROLL ANIMATIONS:
- Each section fades in + slides up 20px when it enters the viewport
- Use IntersectionObserver (no GSAP dependency)
- Respect prefers-reduced-motion: if reduced motion, skip animation (elements visible immediately)

SEO META TAGS (add to <head>):
- <title>World Cup 2026 Prediction Challenge — Predict & Win</title>
- <meta name="description" content="Enter for €1. Predict World Cup match scores, earn points, and win real cash prizes. 3,847 players already entered. Join now.">
- Open Graph: og:title, og:description, og:image (use a 1200x630 stadium banner image placeholder)
- Twitter Card: summary_large_image
- Canonical URL

PERFORMANCE:
- Lazy load the LivePreviewSection data (it fetches from API)
- Preload the hero section fonts (Clash Display or Space Grotesk)
- Add loading="lazy" to any images

ANALYTICS EVENTS (stub):
- Track: "cta_click" (Enter Now buttons), "faq_open" (accordion), "section_view" (IntersectionObserver)
- Use a generic analytics.track(event, properties) stub that can be connected to Plausible, PostHog, or GA4

If using Next.js: this is a Server Component page (app/page.tsx) with the LivePreviewSection as a client component for data fetching. Apply generateMetadata() for SEO.

Output: Complete assembled landing page with SEO, animations, and analytics stubs.
```

---

## SECTION 19 — Authentication Pages (Login & Register)

```
Build the Login and Register pages that users see before accessing the platform.

SHARED DESIGN:
- Background: deep navy #0A0F1C with subtle blue radial glow
- Card: dark surface #0F1A2E, 480px max-width, centered, rounded corners, 32px padding
- Logo at top of card
- All inputs: dark bg #0A1929, white text, #0057B8 focus border
- Primary button: #0057B8

--- LOGIN PAGE (/login) ---

Fields:
- Email address
- Password (with show/hide toggle)
- "Remember me" checkbox

Actions:
- "Log in" primary button
- "Forgot password?" link (→ /forgot-password)
- Divider "or"
- "Continue with Google" OAuth button

Footer: "Don't have an account? Join for €1 →" (links to /register)

Error states:
- Wrong credentials: red inline alert "Incorrect email or password."
- Too many attempts: "Too many failed attempts. Try again in 5 minutes."

--- REGISTER PAGE (/register) ---

Fields:
- Full name
- Email address
- Password (with strength indicator: weak/fair/strong)
- Confirm password

Payment section (below a divider "Complete your entry"):
- Entry fee: "€1.00" — displayed prominently
- Payment method tabs: Card | PayPal | Mobile Money
- Card: Stripe Elements card input (or placeholder input styled to match)
- Terms checkbox: "I agree to the Terms & Conditions and am 18+"

Actions:
- "Create account & pay €1" primary button
- "Already have an account? Log in" link

Success state:
- Redirect to /dashboard with a toast "Welcome! Your entry is confirmed. Good luck! 🏆"

API:
- POST /api/auth/register → { name, email, password, paymentToken }
- POST /api/auth/login → { email, password } → returns JWT + user object

Output: LoginPage + RegisterPage components.
```

---

## SECTION 20 — User Dashboard (Public-facing, post-login)

```
Build the user-facing dashboard at /dashboard (what players see after logging in).

This is different from the admin panel — it's the player's personal competition hub.

LAYOUT:
- Top nav: logo + "My Dashboard" + notification bell + avatar dropdown (Profile, Settings, Log out)
- Main content: single column, max-width 900px, centered

SECTIONS:

1. Welcome Banner:
   "Welcome back, Carlos 👋"
   "You're ranked #3 — keep predicting to climb to #1!"
   — Background: dark navy with blue glow, player's rank prominently displayed

2. My Stats Row (4 cards):
   - My Rank: #3 / 3,847
   - My Points: 39
   - Predictions Made: 17 / [total matches]
   - Exact Scores: 6

3. My Predictions Table:
   - Columns: Match | My Prediction | Actual Score | Points | Status
   - Status badges: Pending | Correct | Wrong | Exact (gold)
   - Sorted by match date descending

4. Upcoming Matches — Predict Now:
   - Cards for matches not yet predicted (or prediction still open)
   - Each card: flag + team vs flag + team + kickoff time + "Predict" button
   - Clicking "Predict" opens a prediction modal:
     * Two score inputs (home | away)
     * "Submit prediction" button
     * Locks at match kickoff

5. Leaderboard (top 10, with player's position highlighted):
   - Same leaderboard table as admin, but read-only
   - Player's own row is highlighted with a subtle blue bg

6. Invite Friends:
   - Referral link with copy button
   - "Invite 3 friends, get a bonus prediction on the Final!"
   - Social share buttons: WhatsApp, Twitter, copy link

API:
- GET /api/me → { user, stats, predictions, upcomingMatches }
- GET /api/leaderboard?limit=10 → [{ rank, name, points, ... }]
- POST /api/predictions → { matchId, homeScore, awayScore }

Output: UserDashboardPage component with all sections.
```

---

*End of prompt set. Total sections: 20 (12 admin + 8 public/user-facing)*

---

## QUICK REFERENCE: API Endpoints Summary

| Endpoint | Method | Section |
|---|---|---|
| /api/admin/stats | GET | §2 |
| /api/admin/matches | GET / POST | §3, §4 |
| /api/admin/matches/:id | PUT / DELETE | §4 |
| /api/admin/leaderboard | GET | §5 |
| /api/admin/analytics/predictions | GET | §6 |
| /api/admin/revenue/snapshot | GET | §6 |
| /api/admin/revenue/export | GET | §8 |
| /api/admin/activity | GET | §6 |
| /api/admin/users | GET | §7 |
| /api/admin/payments | GET | §8 |
| /api/admin/payments/export | GET | §8 |
| /api/admin/predictions | GET | §9 |
| /api/admin/predictions/:id/dispute | PATCH | §9 |
| /api/admin/analytics | GET | §10 |
| /api/admin/settings/:category | GET / PATCH | §11 |
| /api/admin/bracket | GET | §12 |
| /api/public/live-matches | GET | §15 |
| /api/public/leaderboard | GET | §15, §20 |
| /api/auth/register | POST | §19 |
| /api/auth/login | POST | §19 |
| /api/me | GET | §20 |
| /api/predictions | POST | §20 |
