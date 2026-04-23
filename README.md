# Job Tracker App (Option C)

## Links

- GitHub: https://github.com/CMorris358/IS4447-120346221-job-application-tracker.git
- Expo: https://expo.dev/preview/update?message=Actual+Final+submission+had+to+fix+date+bug+on+insights+screen&updateRuntimeVersion=1.0.0&createdAt=2026-04-23T12%3A20%3A59.520Z&slug=exp&projectId=b8aa88fa-89da-4f01-9211-d0b97ee72d45&group=16a4992f-8a96-4930-bbec-bf7339a2b87c

## Description

This project is a mobile job application tracker built using React Native, Expo and SQLite with Drizzle ORM. The app allows users to record and manage job applications, organise them using categories, set targets and view insights on their progress. The idea came from my own situation as I am currently applying for roles, so I built something that would actually be useful for me.

## Features

- Add, edit and delete job applications
- Categorise job role types with colours
- Track a “want level” using a count field
- Set targets and track progress
- Insights screen with daily, weekly and monthly views
- Streak tracking for consecutive application days
- Search and filter functionality
- User login, register, logout and delete profile
- Light and dark mode toggle

## Tech Stack

- React Native (Expo)
- TypeScript
- SQLite (expo-sqlite)
- Drizzle ORM

## How to Run

1. Clone the repository
2. Run `npm install`
3. Start the app with `npx expo start`
4. Open using Expo Go on your phone

## Testing

The project includes:

- Unit test for the seed function
- Component test for the FormField component
- Integration test for the main list screen

Run tests using:

- npm test

## Notes / Limitations

- The app is designed for mobile use and works through Expo Go on iOS and Android
- It does not support Web due to SQLite not being fully supported in browser environments

## AI Usage

AI tools such as ChatGPT were used to help with UI ideas and debugging. All outputs were reviewed and understood before applying.
