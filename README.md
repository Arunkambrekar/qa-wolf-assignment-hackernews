# QA Wolf Assignment – Hacker News Sorting Check 

This Playwright automation script checks whether the first 100 articles on Hacker News' "newest" page are sorted from newest to oldest based on their timestamps.

##  Features

- Automatically loads more articles by clicking the "More" button
- Converts relative timestamps (e.g., "3 minutes ago") into minutes
- Checks if articles are sorted from newest to oldest
- Handles flaky behavior by exiting safely if content stops loading

##  Tech Stack

- Playwright
- JavaScript (Node.js)

##  Code Walkthrough Video

[Loom Video Walkthrough](https://www.loom.com/share/your-link)

##  How to Run

```bash
npm install
node index.js



