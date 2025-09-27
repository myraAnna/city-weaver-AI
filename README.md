# Travel-Jer 🇲🇾

> Your Malaysian Travel Companion - Experience Malaysia through the eyes of a local

## 🎯 Problem Statement

**Design a solution using GenAI for Digital Creativity & Insights**

Travelers face three major challenges:
- **Tourist traps** - How do I find authentic local experiences instead of overpriced tourist spots?
- **Time-consuming research** - Hours spent scrolling through reviews and blogs to plan a trip
- **Last-minute stress** - Need a solid plan quickly but overwhelmed by options

## 💡 Solution

Travel-Jer is a conversational AI travel planner that acts like your Malaysian friend. Get paired with authentic local personas—like Auntie Lim from Penang or Asha from Sabah—who guide you through Malaysia with personal stories, insider tips, and cultural insights.

It's not just directions. It's experiencing Malaysia through someone who calls it home.

## ✨ Key Features

- **Local Personas** - Choose your travel style and get matched with a Malaysian persona (foodie, nature lover, history buff, etc.)
- **Natural Conversations** - Chat naturally: "It's raining! Any indoor spots nearby?" Plans adapt on the fly
- **Smart Itineraries** - 2-3 stop plans with stories, live weather/traffic updates, and local transport tips
- **Cultural Storytelling** - Learn local phrases, hear real stories, discover hidden gems only locals know

## 🚀 What Makes It Different

**vs ChatGPT:** Not just facts, but a friend with deep Malaysian cultural knowledge

**vs Google Search:** Curated recommendations that adapt to weather, traffic, and your mood—not endless overwhelming results

**vs Travel Apps:** Cultural context and local secrets, not just point A to point B directions

## Project Architecture

### Directory Structure
- `src/app/` - Next.js App Router pages
- `src/components/` - Reusable UI components and features
  - `ui/` - Base UI components (buttons, cards, modals)
  - `features/` - Business logic components
  - `forms/` - Form-related components
  - `layout/` - Layout and navigation components
- `src/hooks/` - Custom React hooks for API calls and state
- `src/services/` - API services and data fetching
- `src/contexts/` - React Context providers
- `src/utils/` - Utility functions and helpers
- `src/types/` - TypeScript type definitions
- `src/data/` - Static data and mock data

## Key Features
- AI-powered travel planning interface
- Interactive conversational chat system
- Real-time itinerary management
- Maps integration and route planning
- Weather API integration
- Travel personas and style selection
- Responsive mobile-first design
- Context-aware planning system

## API Integration
- Places API for location data
- Weather API for real-time conditions
- Routes API for navigation
- Mock API for development
- Chat API for conversational interface

## Tools & Technologies

### Core Framework
- **Next.js 15.5.4** - React framework with TypeScript support
- **React 19** - Frontend UI library
- **TypeScript 5** - Type-safe JavaScript

### Design System
The project uses a custom dark-first color palette featuring:
- Deep near-black backgrounds (#0A0A0A, #111111)
- Off-white text (#F5F5F5) with secondary grays
- Magic gradient from teal (#00D4AA) to lavender (#B794F6)
- Custom animations including glow effects, shimmers, and weave patterns
- Inter font family with JetBrains Mono for code

## 🏃 Getting Started

### 🔗 Related Repositories
- **Backend API:** [TravelJer_backend](https://github.com/BiQiB7/TravelJer_backend)

[Add installation and setup instructions]
```bash
# Clone the repository
git clone [your-repo-url]

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run the application
npm start
