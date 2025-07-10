# Proficia

Proficia is a modern, full-stack web application designed to help users learn, practice, and track their progress in various technology topics. It features interactive tests, gamification, user profiles, statistics, and a clean, responsive UI.

## Features

### 1. Authentication & User Management
- **Email/Password Registration & Login**: Secure sign-up and login with validation (username, password, email).
- **Google OAuth**: One-click sign-in/sign-up with Google.
- **Username Setup**: Enforces unique, validated usernames (3-20 chars, lowercase, numbers, underscores).
- **Password Policy**: Passwords must be 8-16 characters, no newlines allowed.
- **Profile Management**: Users can update their profile, change password, and set a custom avatar.

### 2. Learning & Practice
- **Practice Tests**: Take topic-based tests with multiple question types (multiple choice, true/false, text).
- **Daily Practice Limit**: Restricts the number of daily practice tests to encourage consistent learning.
- **Test Timer**: Timed tests with auto-submit on timeout.
- **Exit Confirmation**: Prevents accidental navigation away from an in-progress test with a confirmation modal.
- **Test Submission**: Immediate feedback and results after submitting a test.

### 3. Gamification
- **XP & Levels**: Earn XP for completing tests, level up as you progress.
- **Streaks**: Maintain daily streaks for consistent practice.
- **Badges**: Earn badges for achievements (future feature).

### 4. Analytics & Statistics
- **Test Results**: View detailed results after each test, including correct/incorrect answers and explanations.
- **Statistics Dashboard**: Track your progress, XP, streaks, and test history.
- **Recent Tests**: See your recent test activity and performance.

### 5. Admin Features
- **Admin Dashboard**: Manage users, view analytics, and toggle admin status.
- **User Management**: Admins can view, update, and manage user accounts.

### 6. UI/UX
- **Responsive Design**: Fully responsive for desktop and mobile.
- **Modern UI**: Clean, accessible, and visually appealing interface.
- **Dark Mode**: Toggle between light and dark themes.
- **Animated Landing Page**: Engaging animated topics and call-to-action.

### 7. Technology Stack
- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API routes, Prisma ORM, PostgreSQL
- **Authentication**: NextAuth.js
- **State Management**: React Context, custom hooks

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   - Copy `.env.example` to `.env` and fill in the required values (database URL, NextAuth secrets, etc.)
4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```
5. **Start the development server**
   ```bash
   npm run dev
   ```
6. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Folder Structure
- `app/` - Next.js app directory (pages, API routes, layouts)
- `components/` - Reusable React components
- `contexts/` - React context providers (theme, session, etc.)
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and server-side logic
- `prisma/` - Prisma schema and migrations
- `public/` - Static assets
- `section/` - Landing page and marketing sections
- `types/` - TypeScript type definitions

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

---

**Proficia** — Level up your tech skills, one test at a time!
