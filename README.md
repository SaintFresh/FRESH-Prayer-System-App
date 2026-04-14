# FRESH With Prayer

FRESH With Prayer is a 7-day Scripture Prayer System designed to guide you through daily spiritual discipline and continuous growth. Built as a privacy-first, local-only web application, it helps users establish a consistent rhythm of prayer, reflection, and scripture memorization. FRESH stands for **F**rom **R**aw **E**xperience, **S**hape **H**istory.

## 🌟 Features

* **Daily Rhythm**:
  * **Morning Session**: Deep meditation, guided prayer, and scripture reading (30-min session).
  * **Midday Check-In**: Quick alignment questions and prayers to stay focused (2-min session).
  * **Evening Reflection**: Daily rating, reflection notes, and evening declarations (5-min session).
* **Weekly Progress Tracking**: Visual overview of your completed sessions throughout the week.
* **Victory Log**: A weekly journal to track your spiritual growth across five pillars: Surrender, Focus, Discipline, Alignment, and Victory.
* **Memorization Tracker**: Keep track of the verses you are memorizing each week.
* **Master Declaration**: A central place for your core spiritual declarations.
* **Privacy-First (Local Storage)**: All your journal entries, logs, and progress are stored securely on your local device. No cloud syncing, ensuring complete privacy.
* **Data Management**: Export your data to a JSON file for backup, and import it to restore your progress across devices.

## 🛠 Tech Stack

* **Frontend Framework**: React 18 with TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS
* **Animations**: Motion (Framer Motion)
* **Icons**: Lucide React
* **Date Manipulation**: `date-fns`
* **Notifications**: Sonner (Toast notifications)

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn

### Installation

1. Clone the repository or download the source code.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000` (or the port specified in your terminal).

## 📁 Project Structure

* `/src/components`: Reusable UI components (e.g., ConfirmModal).
* `/src/screens`: Main application views (TodayDashboard, MorningSession, VictoryLog, etc.).
* `/src/lib`: Utility functions (date formatting, class merging).
* `/src/data`: Data management and local storage services.
* `AppContext.tsx`: Global state management using React Context.
* `config.ts`: Configuration for the 7-day weekly content (themes, verses, prayers).
* `types.ts`: TypeScript interfaces and type definitions.

## 🔒 Data Privacy

FRESH With Prayer is designed to be a personal, private tool. All data is saved exclusively to your browser's `localStorage`. If you clear your browser data, your progress will be lost. Use the **Export Data** feature in the Settings menu to regularly back up your journals and progress.
