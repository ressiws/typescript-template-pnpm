# ⚙️ TypeScript PNPM Base

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Made with PNPM](https://img.shields.io/badge/Built%20with-PNPM-f69220?logo=pnpm)
![TypeScript](https://img.shields.io/badge/TypeScript-%F0%9F%94%A5-blue?logo=typescript)
![Custom Builder](https://img.shields.io/badge/Custom%20Builder-%E2%9C%94-lightgrey)
![Logger](https://img.shields.io/badge/Logger-Emoji%20Powered-yellow)
![License](https://img.shields.io/badge/License-CC%20BY%204.0-blue?logo=creativecommons)
![Last Commit](https://img.shields.io/github/last-commit/ressiws/typescript-template-pnpm)
![Open Issues](https://img.shields.io/github/issues/ressiws/typescript-template-pnpm)
![Stars](https://img.shields.io/github/stars/ressiws/typescript-template-pnpm?style=social)

> A simple and generic TypeScript starter powered by PNPM, with a custom builder and a clean logging system.

## 🚀 About 

This is a basic template for any TypeScript project. It's not tied to a specific use — you can use it to build bots, APIs, scripts, or anything else you want.

It includes a **custom builder** that compiles your code and handles everything for you, so you can focus on building your project.

## ✨ Features

- 📦 Uses **PNPM** as the package manager
- ⚙️ **Custom builder**:
  - Organizes output structure
  - Automatically copies assets
  - Replaces string patterns
  - Fixes TypeScript import paths after build
  - Clean and colorful logs with emojis
  - Optional `--debug` mode to show what's going on under the hood
  - `--force` option to clean and rebuild everything from scratch
- 🖥️ **Developer mode** with `pnpm run dev` — auto-restarts and watches for changes
- 📋 **Custom logger** with log levels (info, warn, error) and emojis
- 🔍 **ESLint** for code quality
- 🧱 Minimal and clean project structure

## 📁 Project Structure
```
├── .build/ # Builder settings and internal state
├── scripts/ # Scripts used by the builder
├── src/ # Your TypeScript source code
├── src/config.ts # Project configuration file
└── types/ # Types used internally
```

## 📦 Getting Started

1. **Install dependencies:**

```bash
pnpm install
```
2. Run in development mode (auto compile & start):
```bash
pnpm run dev
```
> No need to manually build or restart. It watches for changes and runs the latest code.

3. Build your project manually (optional):
```bash
pnpm run build
```
### Optional build flags:
- `--debug`: Shows detailed builder logs

> Example:
```bash
pnpm run build --debug
```

# 📜 Scripts
| Command                         | Description |
|---------------------------------|-------------|
| `pnpm run dev`                  | Starts in dev mode with file watching. Reloads on Save. |
| `pnpm run build`				  | Builds the project using the custom builder. |
| `pnpm run build --debug`        | Shows detailed builder logs (useful for debugging build issues.) |
| `pnpm run lint`                 | Lints the code using ESLint to catch errors and enforce style. |
| `pnpm run backup <msg>`         | Creates a `.zip` backup of the current state. |

> [!TIP]
> Run `pnpm run lint` before **build** to avoid dumb mistakes in production.

> [!WARNING]
> Using `--force` will take more time bacause it fully resets the build folder and start from a clean state.

> [!CAUTION]
> Don't use `debug` mode in production. The config system will automatically warn you if it's enabled while in a production environment.

# ✅ Requirements
- **Node.js 18+**
- **PNPM**

# 🧠 Tips
- All your code goes in the `src/` folder.
- You can change settings in `config.ts`.
- Use the `loader` to initialize and organize your boot sequence — helpful for loading services, components, or other logic in a clean way.
- The builder takes care of everything — you don't need to configure anything else.

# 🧾 License
This project is licensed under the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

You are free to use, modify, and redistribute the code, even commercially — as long as you **give appropriate credit.**

# 🙌 Credits
Built with ❤️ by [DarkenLM](https://github.com/darkenlm) and [swisser](https://github.com/ressiws), just two devs who believe semicolons are optional but clean code isn't.

> They log with emojis, debug with sarcasm, and break this just to fix them better.