# AIVAK AI Business Assistant

A production-ready React Native chatbot application built with Expo, featuring Gemini AI integration and Firebase authentication. Designed specifically for small and medium business owners.

## 🚀 Features

- **AI-Powered Chat**: Intelligent business assistant using Google's Gemini AI
- **Context Retention**: Maintains conversation context within chat sessions
- **Secure Authentication**: Firebase Auth with email/password + Google Sign-In
- **Business-Focused UI**: Professional design optimized for 35+ business users
- **Cross-Platform**: Runs on iOS, Android, and Web
- **Offline Storage**: Secure token management with Expo SecureStore

## 🛠 Tech Stack

- **Frontend**: React Native with Expo (TypeScript)
- **State Management**: Redux Toolkit
- **UI Components**: React Native Paper (Material Design)
- **Authentication**: Firebase Auth
- **AI Integration**: Google Gemini API
- **Navigation**: React Navigation v6
- **Storage**: Expo SecureStore

## 📱 Screenshots

Comming Soon

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI
- Firebase project setup
- Gemini API key

### Installation

Clone repository
git clone [your-repo-url]
cd M32ChatbotApp

Install dependencies
npm install

Start development server
expo start

### Configuration

1. Create `firebaseConfig.js` with your Firebase credentials
2. Update Gemini API key in `src/services/geminiService.ts`
3. Configure Google Auth client IDs in `authService.ts`

## 📖 Usage

1. **Sign Up/Login**: Create account or sign in with Google
2. **Chat Interface**: Ask business questions to the AI assistant
3. **Context Retention**: AI remembers conversation within sessions
4. **Profile Management**: View profile and manage chat history

## 🏗 Project Structure

src/
├── components/ # Reusable UI components
├── screens/ # Screen components
├── navigation/ # Navigation configuration
├── store/ # Redux store and slices
├── services/ # API services (Auth, Gemini)
├── theme/ # UI theme configuration
└── types/ # TypeScript type definitions

## 🔧 Build & Deploy

### Development Build

expo build:android --type apk

### Production Build with EAS

eas build -p android --profile production

## 🎯 Business Features

- **Invoice Management**: AI assistance with billing and invoicing
- **Market Analysis**: Business insights and competitive analysis
- **Strategic Planning**: Growth planning and business advice
- **Operational Efficiency**: Process optimization recommendations

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request

## 📞 Support

For support, email Krushnanaghate25@gmail.com or create an issue on GitHub.

---

**AIVAK AI Assistant - Your Business Companion** 🚀
