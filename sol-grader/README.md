# SolGrader - AI-Powered Assignment Grading Platform

SolGrader is a Next.js application that leverages AI to automate grading, provide personalized feedback, and offer AI-powered chat assistance for educational assignments.

## Features

- **Automated Grading:** Process assignments quickly and consistently using AI
- **Personalized Feedback:** Generate tailored feedback for each student
- **AI-Powered Chat:** Provide immediate assistance through Groq AI's language model
- **Vision-Based Processing:** Upload and process handwritten assignments with AI vision
- **Dashboard Analytics:** View insights for both teachers and students
- **Responsive Design:** Optimized for all devices using TailwindCSS

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **Form Handling:** react-hook-form with zod validation
- **Data Visualization:** Recharts
- **AI Integration:** Groq AI API (for chat and vision capabilities)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sol-grader.git
   cd sol-grader
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable UI components
  - `/ui` - shadcn/ui components
  - `/layout` - Layout components like navigation
- `/lib` - Utility functions and helpers
- `/public` - Static assets like images

## API Endpoints

- `/api/grade` - Handles processing assignments using NLP
- `/api/feedback` - Generates personalized feedback
- `/api/vision` - Processes image-based assignments
- `/api/chat` - Manages real-time chat interactions

## Setting Up Groq API

To use the AI features, you'll need a Groq API key:

1. Sign up at [https://console.groq.com/](https://console.groq.com/)
2. Create an API key from your dashboard
3. Add the key to your settings page in the application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
