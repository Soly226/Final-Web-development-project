# EduCore LMS – How the Admin System Works
### A Plain-Language Explanation (No Technical Jargon)

---

## What Is This System?

EduCore is an **online learning platform** — think of it like a university's digital home. It has three types of users:

| Who They Are | What They Can Do |
|---|---|
| **Students** | Take courses, submit assignments, view grades |
| **Instructors** | Teach courses, post materials, grade students |
| **Admins** | Run and manage the entire platform |

This document explains the **Admin's world** — the rules, the safety features, and the reasons behind how the system behaves.

---

## Rule 1 — "Your Security Pass Stays in a Locked Vault" (Authentication)

Before anyone can view or change anything in the admin panel, the system asks: *Are you really an admin?*

Here is how it works under the hood:
1. You enter your **email** and **password** on the login page.
2. The system checks the database. Your password is **never stored as plain text** — it is scrambled into a secure code (a *hash*). The system verifies if the passwords match.
3. Once verified, the system gives you a **digital security badge** (a *session token*).
4. **The Safe Pass (HttpOnly Cookie)**: Instead of handing the badge to your browser's regular memory (where malicious scripts could steal it), the server places the badge in a **locked vault** (called an *HttpOnly cookie*).
5. **No Peeking**: The browser can show the badge to the server on every click, but no website code is allowed to read it or copy it.
6. **Automatic Badge Return**: Every time you click on settings or courses, the browser automatically presents this badge.
7. **Logout**: When you log out, the server destroys the badge, clearing the session.

---

## Rule 2 — "Platform Settings & File Uploads"

The platform has global settings — things like the **platform name**, the **language**, and the **system logo**.

- There is **only one set of settings** for the whole platform at any time. When you make changes, the system **overwrites** the old settings and writes a note in the audit logs.
- **Logo Uploading**: When you select an image file to upload as the logo, the system:
  1. Shows you an immediate preview of the image in your browser.
  2. Sends the file to the server's disk storage.
  3. Updates the settings database with the path to the saved logo so it displays across the platform.

---

## Rule 3 — "Data Validation Guardrails"

The system has a digital checklist for every form you fill out. This is called **data validation**. It acts like a form checker at a registry desk:
- If you try to save settings with an invalid SMTP email server port (like `abc` or `-5`), the form stops you.
- If you try to send a broadcast message with a blank title, or an email template with an empty subject, the system will highlight the field in red and disable the save button.
- The same rules are enforced on both the **frontend** (your screen) and the **backend** (the server), preventing bypasses.

---

## Rule 4 — "Course Registry Rules"

Courses are the heart of the platform. Here are the admin rules:
- **No duplicates**: No two courses can share the same course code or ID.
- **Prerequisite Rules**: To take Course B, a student might need to complete Course A first. The system ensures:
  - A course cannot require itself (no circular loops).
  - When a course is deleted, its prerequisite rules are also deleted, so there are no broken links.
  - Before enrolling a student, the system checks if they have successfully completed the prerequisite.

---

## Rule 5 — "All Important Actions Are Logged"

The system runs an **Activity Log** (Audit Trail) — a continuous list of everything important that happens:
- Logs cannot be deleted or modified through the admin panel.
- Each entry records **what happened, who did it, and when**.
- The main page shows the latest events, while a detailed log viewer allows searching older logs using pagination (loading page-by-page to keep things fast).

---

## Rule 6 — "Secure Channels (HTTPS)"

To prevent hackers from snooping on passwords or settings as they travel over the internet, we use **HTTPS** (encrypted channels).
- The system generates a digital safety certificate on localhost.
- This scrambles all data sent between the browser and the server, so anyone intercepting the traffic sees only garbage characters.
