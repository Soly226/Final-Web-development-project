# Basel's Modules: Communication & Messaging

This document explains what Basel's parts of the application do and how they function.

## 📥 1. Messages Inbox
- **What it does**: Allows students and instructors to view messages they received, check sent messages, read system announcements, and write new messages.
- **Key Files**: 
  - `frontend/src/pages/messages/MessagesInboxPage.jsx` (Conversations UI)
- **How it works**: 
  - It calls backend message APIs to fetch received/sent messages. Clicking on a message marks it as read. Users can write a message by searching for a recipient and sending a JSON payload.
  - **New Update**: Integrated a high-fidelity shimmering skeleton loader element that replaces simple "Loading..." text displays when opening messages.
  - **New Update**: Connected the global toast notification context system to show alerts (e.g. "Message sent successfully!", "Message deleted successfully") when interacting with conversations.

## 🔔 2. Notifications System
- **What it does**: Displays real-time alerts or event notifications to users when activities occur.
- **Key Files**:
  - `frontend/src/pages/notifications/NotificationsPage.jsx`
- **How it works**: Periodically polls or reads notifications stored in the database for the logged-in user, showing alerts like new messages or system alerts.

## 📁 Complete File Inventory
The following files are owned/authored by Basel:
- **Backend Routes & Models**:
  - `backend/routes/messageRoutes.js`
  - `backend/routes/notificationRoutes.js`
  - `backend/models/Message.js`
  - `backend/models/Notification.js`
- **Frontend Pages & Components**:
  - `frontend/src/pages/messages/MessagesInboxPage.jsx`
  - `frontend/src/pages/notifications/NotificationsPage.jsx`
