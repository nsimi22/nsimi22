# SimiCode IDE Mobile

An AI-powered mobile code editor with Claude integration. Edit code, manage git repositories, and leverage AI assistance directly from your mobile device.

## Features

- **AI-Powered Coding**: Integrated Claude AI for code editing, explanations, and suggestions
- **Terminal Interface**: Familiar command-line interface optimized for mobile
- **File Browser**: Browse and edit files from cloud storage (iCloud)
- **Git Integration**: Commit changes and create pull requests on the go
- **Authentication**: Support for both OAuth and API key authentication

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nsimi22/SimiCodeIDE-Mobile.git
cd SimiCodeIDE-Mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with Expo Go app for physical device

## Usage

### Authentication

Before using the AI features, authenticate with your Anthropic account:

- **OAuth**: Type `/login` in the terminal
- **API Key**: Type `/auth <your-api-key>`

Get your API key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

### Commands

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/login` | Sign in with OAuth |
| `/auth <key>` | Authenticate with API key |
| `/whoami` | Show current user info |
| `/logout` | Sign out |
| `/files` | Toggle file browser |
| `/status` | Show git status |
| `/diff` | Show pending changes |
| `/commit <msg>` | Commit staged changes |
| `/pr <title>` | Create a pull request |
| `/clear` | Clear terminal |

### Interacting with Claude

Simply type your request in the terminal:

- "Add error handling to the API functions"
- "Explain this code"
- "Refactor this function to use async/await"
- "Fix the bug in the login flow"

## Architecture

```
src/
├── components/       # UI components
│   ├── common/      # Shared components (Icon, etc.)
│   ├── terminal/    # Terminal UI components
│   ├── file-browser/ # File tree components
│   ├── git/         # Git-related components
│   └── settings/    # Settings modal
├── contexts/        # React contexts
│   ├── AuthContext  # Authentication state
│   ├── FileTreeContext # File system state
│   └── TerminalContext # Terminal state
├── services/        # API and storage services
│   ├── claude.ts    # Claude API integration
│   └── storage.ts   # Secure storage
├── screens/         # Main screens
├── hooks/           # Custom React hooks
├── types/           # TypeScript types
├── utils/           # Utility functions
└── constants/       # App constants
```

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Zustand** for state management
- **Expo Secure Store** for secure credential storage
- **Claude API** for AI features

## Building for Production

### iOS

```bash
npm run build:ios
```

### Android

```bash
npm run build:android
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Acknowledgments

- [Anthropic](https://anthropic.com) for Claude AI
- [Expo](https://expo.dev) for the development framework
- [Lucide](https://lucide.dev) for the icon set
