# PathPilot — Student Opportunity Tracker

A responsive browser-based project for organizing internships, jobs, hackathons, courses, and scholarships in one dashboard.

## Features
- Dashboard counts for total opportunities, in-progress items, interviews, and offers.
- Add an opportunity with title, company/organizer, category, status, deadline, optional link, and notes.
- Search across title, company, category, notes, and status.
- Combine status and category filters.
- Update a record's status, open a saved URL, or delete a record.
- Persist records in browser `localStorage` across reloads in the same browser profile.
- Responsive layout for desktop and mobile screens.
- Escaped user text and allow-listed HTTP/HTTPS external links.
- Five sample records are loaded for demonstration on first run.

## Run the project
1. Download and extract the project folder.
2. Open `index.html` in a modern browser (Chrome, Edge, Firefox, or Safari).
3. Add, search, filter, update, and delete opportunities.

No Node.js, package installation, server, API key, or database is required for this demonstration version.

## Folder structure
```text
opportunity-tracker/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── screenshots/
│   ├── dashboard.png
│   └── filtered-view.png
└── README.md
```

## Storage and limitations
Records are stored under `pathpilot_opportunities_v1` in browser localStorage. They are local to this browser profile and are not synchronized between devices or users. Clearing browser site data can remove saved entries. This is a portfolio/demo prototype, not a production application. A deployed version should add a backend API, shared database, authentication, authorization, server-side validation, HTTPS, backups, and privacy controls.

## Test checklist
- Open the page and verify sample cards and counters appear.
- Add a valid opportunity and verify the list and counters update.
- Search for a company or keyword with different capitalization.
- Apply status and category filters together.
- Update a status and verify the counter changes.
- Delete an item after confirming the prompt.
- Reload the page and confirm saved changes persist in the same browser profile.
- Submit without a required title/company and confirm browser validation blocks submission.
- Enter a malformed link and confirm validation feedback appears.
- Resize the browser to a narrow width and confirm the layout remains usable.

## Technologies
HTML5, CSS3, vanilla JavaScript, DOM events, browser localStorage, JSON serialization, and responsive CSS.
