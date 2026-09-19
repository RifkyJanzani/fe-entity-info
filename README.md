# entity-info

entity-info is ...

## 📦 Build Status

[![Build Status](https://jenkins.len-iot.id/buildStatus/icon?job=c2-nextgen%2Freact-ts-rspack-template%2Fpre-development&subject=pre-dev)](https://jenkins.len-iot.id/job/c2-nextgen/job/react-ts-rspack-template/job/pre-development/)  
[![Build Status](https://jenkins.len-iot.id/buildStatus/icon?job=c2-nextgen%2Freact-ts-rspack-template%2Fdevelopment&subject=dev)](https://jenkins.len-iot.id/job/c2-nextgen/job/react-ts-rspack-template/job/development/)  
[![Build Status](https://jenkins.len-iot.id/buildStatus/icon?job=c2-nextgen%2Freact-ts-rspack-template%2Fmain&subject=main)](https://jenkins.len-iot.id/job/c2-nextgen/job/react-ts-rspack-template/job/main/)

## 🛠 Version

`0.1.0`

## 👨‍💻 Maintained by

CMS FrontEnd Development  
📩 Email: [engineering@len-iot.io](mailto:engineering@len-iot.io)

---

## 📚 Table of Contents

- [react-ts-rspack-template](#react-ts-rspack-template)
  - [📦 Build Status](#-build-status)
  - [🛠 Version](#-version)
  - [👨‍💻 Maintained by](#-maintained-by)
  - [📚 Table of Contents](#-table-of-contents)
  - [🚀 Getting Started](#-getting-started)
    - [🔧 Prerequisites](#-prerequisites)
    - [📥 Installing](#-installing)
  - [📜 Scripts](#-scripts)
  - [📦 Dependencies](#-dependencies)
  - [🧪 Dev Dependencies](#-dev-dependencies)
  - [💬 Feedback and Contributions](#-feedback-and-contributions)

---

## 🚀 Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### 🔧 Prerequisites

Ensure you have the following installed:

- Node.js (≥ v16.x)
- pnpm (≥ v8.x)

Download from [https://nodejs.org](https://nodejs.org)

### 📥 Installing

Follow these steps to get a development enviro_nment running:

1. Clone the repository:

   ```bash
   git clone https://gitea.len-iot.id/c2-nextgen/react-ts-rspack-template.git
   ```

2. Navigate to the project directory:

   ```bash
   cd react-ts-rspack-template
   ```

3. Create the .env file from the example template:

   ```bash
   cp .env.example .env
   ```

4. Install dependencies:

   ```bash
   pnpm install
   ```

5. Start the development server:

   ```bash
   pnpm run dev
   ```

The application should now be running at [http://localhost:8174](http://localhost:8174)

---

## 📜 Scripts

- `pnpm run dev` – Start development server with HMR
- `pnpm run build` – Create a production build
- `pnpm run test` – Run test suites
- `pnpm run lint` – Lint all code
- `pnpm run lint:fix` – Lint and auto-fix
- `pnpm run format` – Format code using Prettier
- `pnpm run format-lint` – Format then lint
- `pnpm run format-lint:fix` – Format, lint, then fix

---

## 📦 Dependencies

- `react `
- `react-dom `
- `react-icons`
- `zustand `
- `clsx `
- `tailwind-merge `
- `google-protobuf `
- `grpc-web `
- `dotenv `
- ... and many more (see `package.json` for the full list)

---

## 🛠️ Dev Dependencies

- `@rspack/cli`, `@rspack/core`, `@rspack/plugin-react-refresh`
- `typescript`, `ts-jest`, `ts-node`, `tsx`
- `@testing-library/react`, `@testing-library/jest-dom`, `@types/*`
- `jest`, `jest-environment-jsdom`
- `eslint`, `@typescript-eslint/*`, `eslint-plugin-jsdoc`, `eslint-plugin-jest`
- `tailwindcss`, `postcss`, `postcss-loader`, `autoprefixer`
- ... and many more (see `package.json` for the full list)

---

## 🙌 Feedback and Contributions

We welcome feedback, bug reports, and contributions!

- Fork the repo and create branch from `pre-development`.
- Follow the existing coding conventions.
- Run lint and tests before submitting pull request.
