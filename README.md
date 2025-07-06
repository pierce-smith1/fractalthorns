# fractalthorns

![image](https://github.com/user-attachments/assets/e45a2c7a-0ee4-460a-b2d6-aa3031f53160)

[Visit the live site!](https://fractalthorns.com/)

fractalthorns is my personal site and a nexus of the artwork, writing, and other things I do.

**Feel free to contribute!** Open issues or make PRs. Read on below to get set up for local development.

## How it works

fractalthorns is an Astro site with an SPA frontend primarily in Svelte. It also serves a public API, documented [here](https://fractalthorns.com/api/v1/docs), which is in fact what powers the Svelte frontend.

fractalthorns reads content from a SQLite database, which it fully manages. It is initially created and populated via a build step. The content itself is authored by putting files/folders into a content folder via particular conventions that are understood by the build script - for example, each image on the site is defined by a folder with the name of the image containing an `img.png` file, an `info.json` holding metadata such as the title and date made, and optionally a `descr.md` to hold the description - all of this information, _including the binary data for the image_(!), are compiled into the database with the `npm run compile-content` script. The conventions used are not documented explicitly, but a sample content folder is provided for you to work from, and the code in `src/data/loaders` can act as implicit documentation. 

The database is mostly used as a read-only content repository, but there are a limited few tables that are written to at runtime (most notably, to support puzzle solving).

To avoid spoilers, this repo does not contain the actual content folder for the live site. The story, images, source for the live site's puzzles, and some other small things are not present here.

Astro powers the rest of the site's functionality, such as routing pages, making API endpoints, and bundling client code. It is worth taking a trip to [their docs](https://docs.astro.build/en/concepts/why-astro/) to learn some fundamentals of the platform. 

## Setup / Deployment

Requirements:

* Node.js 22 (I use `22.13.0` in production)
* Any operating system that will run node
* Optionally: VS Code to take advantage of the debug configurations in `.vscode`
* Optionally: A SQLite editor to view and edit content tables [(SQLiteStudio is great on the desktop)](https://sqlitestudio.pl/)

To get set up locally:

* Clone this repository
* To use the sample content, rename the `_samplecontent` directory to `_content`
* Create a file called `rvaenv` in the repo root containing the following:
  ```bash
  # The hostname you are running the server on. For local development this 
  # is localhost:4321. 
  # This variable is only used to generate embed links so it's not a big deal 
  # if it's defined correctly, but you must set it to something.
  RVA_SELF_URL="http://localhost:4321"

  # The path to the content folder.
  # Unfortuntaly, because of some limitations with Vite, this MUST be called
  # `_content` and it MUST live in the repo root, so this variable is NOT
  # customizable currently. You may set it to a different path, but puzzles
  # will not function correctly. Sorry :(
  RVA_CONTENT_ROOT="./_content"

  # The path to your database file, prefixed with "sqlite". If it doesn't exist, 
  # it will be created for you when runnning the compile-content command.
  DATABASE_URL="sqlite:rva.sqlite"

  # What environment this is running in. Set to "local" for local development.
  RVA_ENV="local"
  ```
* Run the following commands to install dependencies and create your database:
  ```bash
  npm ci
  npm run compile-content
  ```
* Run the following command to start your server for local development (any code changes you make will hot-reload):
  ```
  npm run dev
  ```
  ...Or, if using VS Code, use the `Development server` debug configuration.
* Run the following commands to start your server for production use:
  ```bash
  npm run build

  # Do something to load your environment variables from `rvaenv`. Here's one way in bash:
  set -o allexport
  source rvaenv
  set +o allexport

  node dist/server/entry.mjs

  # Or, to specify a port (again, bash syntax):
  PORT=4321 node dist/server/entry.mjs
  ```
* To update the content database, run `npm run compile-content` (which you can even do while the server is running!)
  This will read the modified times of the files in the content directory to intelligently determine what entities actually need
  recreating. 
  * If you suspect your database is in a buggy state and needs to be fully remade, you can use
  `npm run fully-recompile-content`, which will do a clean recreation from scratch (tables not derived from content, such as
  puzzle_solve, are preserved. To start fresh for totally real, just delete the database.)
