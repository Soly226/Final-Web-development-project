# Implementation Plan: Jonathan's Admin & Core Migration

This plan outlines the process of converting the static design exports in `stitch_web_project/` into a dynamic React application for Jonathan's assigned modules.

## User Review Required

> [!IMPORTANT]
> **Component Architecture**: I will be extracting common UI elements (Buttons, Inputs, Cards) from the static HTML to create a shared library. This ensures that Seliem and Magdy can use the same components later.
> 
> **Chart Implementation**: The dashboard charts are currently static SVGs in the HTML. I will preserve these as SVGs for now to match the exact design, rather than using a heavy charting library like Recharts, unless you prefer otherwise.

## Proposed Changes

### 🧱 Shared UI Components

#### [NEW] [src/components/ui/Button.jsx](file:///c:/Users/Dell/Downloads/web_project/frontend/src/components/ui/Button.jsx)
Standardized button components (Primary, Secondary, Ghost) with the project's brand colors.

#### [NEW] [src/components/ui/Card.jsx](file:///c:/Users/Dell/Downloads/web_project/frontend/src/components/ui/Card.jsx)
The container component used for stats and section wrappers.

#### [NEW] [src/components/layout/AdminLayout.jsx](file:///c:/Users/Dell/Downloads/web_project/frontend/src/components/layout/AdminLayout.jsx)
A wrapper component containing the Header and Navigation shared across all Admin pages.

### 🔐 Authentication Pages

#### [MODIFY] [src/App.jsx](file:///c:/Users/Dell/Downloads/web_project/frontend/src/App.jsx)
Import and link the new pages to the router.

#### [NEW] [src/pages/auth/LoginPage.jsx](file:///c:/Users/Dell/Downloads/web_project/frontend/src/pages/auth/LoginPage.jsx)
Full migration of `stitch_web_project/login_page`.

#### [NEW] [src/pages/auth/RegisterPage.jsx](file:///c:/Users/Dell/Downloads/web_project/frontend/src/pages/auth/RegisterPage.jsx)
Full migration of `stitch_web_project/register_page`.

### 🛡️ Admin Core Pages

#### [NEW] [src/pages/admin/AdminDashboard.jsx](file:///c:/Users/Dell/Downloads/web_project/frontend/src/pages/admin/AdminDashboard.jsx)
Full migration of `stitch_web_project/admin_dashboard`. Includes stat counters and activity charts.

#### [NEW] [src/pages/admin/SystemLogs.jsx](file:///c:/Users/Dell/Downloads/web_project/frontend/src/pages/admin/SystemLogs.jsx)
Full migration of `stitch_web_project/system_logs_admin`.

#### [NEW] [src/pages/admin/SystemSettings.jsx](file:///c:/Users/Dell/Downloads/web_project/frontend/src/pages/admin/SystemSettings.jsx)
Full migration of `stitch_web_project/system_settings`.

## Open Questions

> [!NOTE]
> 1. For the **Email Template Editor**, do you want a full drag-and-drop builder, or should I stick to the code-based/text-area approach shown in the designs for now?
> 2. Should I implement dark mode toggling logic now, or should we stick to the system preference for this initial phase?

## Verification Plan

### Manual Verification
- Verify that logging in correctly redirects to the Admin Dashboard.
- Ensure all hover states (buttons, interactive cards) match the design specs.
- Test responsiveness across mobile and desktop views for the new layouts.
