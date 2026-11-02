# HumberASV Website - Humber's Roboboat Team

This is the frontend website for Humber's Roboboat Team, SeaForge, built using React, TypeScript, and Vite. This project provides a modern, fast, and type-safe web application with Hot Module Replacement (HMR) and ESLint configured.

## Features

- Built with React + TypeScript for robust and scalable code
- Powered by Vite for fast development build and reload times
- ESLint configured with type-aware lint rules and React-specific plugins
- Easy to extend and maintain for future enhancements

## Getting Started - Clone and Run Locally

Follow these steps to get a local copy of the SeaForge website for development and testing:

### Prerequisites

- Install [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- Have [Git](https://git-scm.com/) installed
- A code editor like [Visual Studio Code](https://code.visualstudio.com/)

### Clone the Repository

Open your terminal and run:

```bash
git clone git@github.com:HumberASV/HumberASV-Website.git
cd HumberASV-Website
```

### Install Dependencies

Install the required packages:

```bash
pnpm install
```

### Run the Development Server

Start the local development server:

```bash
pnpm run dev
```

The site should now be running at http://localhost:5173

## Updating Team Members

Team rosters live in [`data/team-members.xlsx`](data/team-members.xlsx), one tab per competition year. Old tabs are the archive behind the **Past Teams** page (`/team/past`), so don't delete them. The workbook's "How to" tab has the same steps.

To add a new year:

1. Put that year's photos in `src/assets/team/<year>/`: one headshot per member, plus `banner-leads.jpg` (the leadership photo at the top of the page) and `banner-team.jpg` (the whole-team photo).
2. Copy the newest year tab, rename the copy to the new year, and edit the rows. Row order is display order. Set `Section` to `Leadership` or `Team`.
3. Add the year to the `Years` tab with its banner file names. Move `Current = TRUE` to it when it should become the team shown on `/team`.
4. Export and commit:

```bash
pnpm update:members
```

This regenerates `src/data/team.json`, which is what the site reads. Commit both the workbook and the JSON. The script stops with an error if the workbook is malformed, and warns about any photo file it can't find.

To fix a member's info later, edit their row in that year's tab and run `pnpm update:members` again.

Original full-size photos are kept in `assets-raw/`, outside `src`, so they aren't bundled into the site.
