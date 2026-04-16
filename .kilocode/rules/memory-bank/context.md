# Active Context: KreditBee Finance App

## Current State

**App Status**: ✅ Fully built — KreditBee-like finance app

A complete mobile-first finance/lending application styled after KreditBee, built with Next.js 16, TypeScript, Tailwind CSS 4, and lucide-react.

## Recently Completed

- [x] KreditBee-style purple/green theme with mobile-first layout (max 430px)
- [x] Splash page with auto-redirect based on auth state
- [x] Login page with mobile number input + 6-digit OTP flow (demo: any OTP works)
- [x] 4-step KYC registration (Personal Info → KYC docs → Employment → Bank)
- [x] Dashboard with credit limit card, quick actions, loan products carousel
- [x] Apply Loan page with amount/tenure sliders, EMI summary, eligibility check
- [x] Loan Success page with timeline tracker
- [x] My Loans page with active/closed tabs and repayment schedule
- [x] EMI Calculator with amortization table and visual breakdown
- [x] Profile/Account page with credit score gauge and menu sections
- [x] Notifications page with unread badge and mark-all-read
- [x] Terms & Conditions page (full legal clauses, RBI/NBFC info)
- [x] Privacy Policy page (data collection, security, user rights)
- [x] FAQs page with search and accordion sections
- [x] AuthContext with localStorage persistence (user, loans, notifications)
- [x] BottomNav component with active state and notification badge
- [x] PageHeader component with back navigation
- [x] All lint and typecheck errors resolved

## App Structure

| Route | Purpose |
|-------|---------|
| `/` | Splash screen (auto-redirects) |
| `/login` | Mobile + OTP authentication |
| `/kyc` | 4-step KYC/registration flow |
| `/dashboard` | Home dashboard |
| `/apply-loan` | Loan application with sliders |
| `/loan-success` | Post-application success screen |
| `/my-loans` | Active and closed loans |
| `/calculator` | EMI calculator with amortization |
| `/notifications` | Push notification list |
| `/profile` | User profile and settings |
| `/terms` | Terms & Conditions |
| `/privacy` | Privacy Policy |
| `/faq` | Help & FAQ center |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **Icons**: lucide-react
- **State**: React Context API + localStorage
- **Auth**: OTP-based (demo: any 6-digit code)
- **Package Manager**: Bun

## Color Palette (KreditBee-inspired)

- Primary: `#6B21A8` (purple-800)
- Primary light: `#9333EA` (purple-600)
- Accent: `#22C55E` (green-500)
- Background: `#F9F5FF`

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| April 2026 | Full KreditBee-like finance app built |
