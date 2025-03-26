# Pricey

Tracking personal price thresholds and lowest price of items we purchase on a recurring basis.

Convert prices per unit when grocery stores purposefully hide them or markup and discount them while hiding their actual
prices per unit

# TODO:

- [TODO Board](https://github.com/Julchu/Pricey/projects/2)

# Setup

### NodeJS, `npm`, `pnpm`

- You'll need to download [NodeJS](https://nodejs.org/en/) and add `npm` (Node Package Manager) to PATH so that
  you can run commands to download packages used to create React projects.

- The main package you'll need is a separate package manager called `pnpm`, which functions similarly (like a super
  layer) to `npm`

### Why `pnpm`

- `pnpm` installs packages locally in a global way, and symlinks across projects
- `pnpm` installs packages in parallel rather than one-by-one, like `npm` does

### Git

- You'll need [git](https://git-scm.com/downloads) installed to copy the project into your local directory

### Environment files

- You'll need a copy of `.env.example` as your development environment, as well as a production environment when
  deploying to live

```zsh
# Copy and setup your environment
cp .env.example .env.development .env.production
```

### Cloning and installing the app

```zsh
# Go to your preferred project directory; a folder called Pricey will be added
git clone https://github.com/Julchu/pricey.git
cd pricey

# Installing the React app; a browser tab should open at localhost:3000
pnpm install
pnpm dev
```

### Prettier (format on save)

- In VSCode, install the extention Prettier
- Go to your VSCode JSON settings:
    - Command Palette -> Preferences: Open Settings (JSON)
- Add the following code to the JSON object
- Whenever you save a file, it'll run automatic formatting based on rules defined in `/.prettierrc.json`

```json
// settings.json
{
  ...
  "editor.tabSize": 2,
  // Add this to enable autosave in VSCode with Prettier
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  ...
}
```

- I also use file autosave whenever I switch to a different page/window, mimicking Webstorm

```json
{
  "files.autoSave": "onFocusChange"
}
```

## Testing

We're using ESLint to test for basic JavaScript and TypeScript errors

You can run `lint` and `type-check` to check for basic project syntax errors

```zsh
# In root directory (/Pricey)
pnpm lint
pnpm type-check
```

- With Husky and Lint-Staged, project will automatically run these basic checks when trying to commit changes or deploy
  the project, and will block the commit/deployment on errors (not warnings)

# Notes

Projects can be split into

- Front-end: React, Angular, Vue
- Back-end: NodeJS, "servers", Firebase
- Database: Firestore, MongoDB, Postgres

Front-end: how things look from a user's standpoint, or how data is displayed

Back-end: how data is sent to front-end, or how data is saved to database

Database: where data is stored, or locations of non-string data (like files) that are kept in storage

## Understanding React/NextJS

Building React apps involves turning web pages into components (kinda like an HTML Iframe)

Similar but opposite to PHP, where it's HTML structure with in-line code, React is code to structure HTML

Imagine a Discord text-channel as a website: it can be split into multiple pieces:

- Left side bar to view available servers
- Left-mid area to view available channels
- Main chat box w/ text input
- Right side bar to view available users

Each area can be a component, that can be a group of smaller components, which can be a group of smaller individual
components/HTML elements

Sometimes data must be able to appear in multiple components, or be manipulated within specific components and appear in
other components.

Data can be passed downwards to children pretty easily through `props`, tho cycling them back up and/or across is not as
easy.

If you understand `getters` and `setters`, we can also pass down `setter` functions that'll manipulate the
top-level `state` data that is also being passed down to other neighbouring child components

## NextJS Layout

### /components

- For React components, structured as
    - DirectoryName
        - CropAlgorithm.tsx
        - styles.tsx
- Template files:
    - /components/Template: index/styles.tsx
    - /pages/template: CropAlgorithm.tsx

### /pages:

- Files in this directory are treated as API routes instead of React pages
    - RouteName
        - CropAlgorithm.tsx: localhost:3000/RouteName
        - SubRouteName
            - CropAlgorithm.tsx: localhost:3000/RouteName/SubRouteName
            - [templateIndex].tsx: localhost:3000/RouteName/SubRouteName/templateIndex
- CropAlgorithm.tsx files are the displayed components, so `/pages/CropAlgorithm.tsx` will be the base `localhost:3000/`
  file

### /package.json

- Project information, node module dependencies, etc...
- Scripts: commands and aliases to run commands
    - Ex: type-check runs the TS compiler script `tsc` when you call it with `pnpm type-check`
- Dependencies: `pnpm add <packageName>`
    - Required for end user/host to install when building app
    - Ex: NextJS/React, Emotion (styling)
- Dev Dependencies: `pnpm add <packageName> -D`
    - Required for devs to install when building app
    - Ex: linters, formatters

Types or Interfaces?

- Interface for public API's definition when authoring a library or 3rd party ambient type definitions, as this allows a
  consumer to extend them via declaration merging if some definitions are missing.

- Type for your React Component Props and State, for consistency and because it is more constrained.

  > https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/#types-or-interfaces

- Use Interface until You Need Type
  > https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces