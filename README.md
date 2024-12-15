# MunchWise Tracker

A comprehensive nutrition tracking application that helps users monitor their daily food intake, track macronutrients, and analyze their eating habits over time.

## Features

- **User Authentication**: Secure email/password authentication powered by Supabase
- **Profile Management**: Personalized user profiles with customizable nutrition goals
- **Food Tracking**: Log meals with detailed nutritional information
- **Real-time Analytics**: Visual representation of nutrition data using charts
- **Goal Setting**: Set and monitor daily calorie and macronutrient targets
- **Progress Monitoring**: Track progress with animated circular progress indicators

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - Vite for build tooling
  - Tailwind CSS for styling
  - shadcn/ui for UI components
  - Recharts for data visualization
  - React Query for data fetching and caching

- **Backend (Supabase)**:
  - PostgreSQL database
  - Row Level Security (RLS) policies
  - Edge Functions for custom logic
  - Real-time subscriptions
  - User authentication

## Supabase Features Utilized

1. **Authentication**
   - Email/password authentication
   - Protected routes
   - User session management

2. **Database**
   - `profiles` table for user information and goals
   - `food_entries` table for meal tracking
   - Row Level Security (RLS) policies for data protection
   - Database triggers for user profile creation

3. **Edge Functions**
   - Custom nutrition goals calculation
   - Food analysis using AI

## Local Development Setup

1. **Prerequisites**
   - Node.js (v18 or higher)
   - npm or yarn package manager
   - Git

2. **Clone the Repository**
   ```bash
   git clone https://github.com/asrvd/munchwise
   cd munchwise
   ```

3. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

4. **Environment Setup**
   Create a `.env` file in the root of the project and add the following variables from your Supabase project:
   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```
   You will also need a Together AI's API key and you will have to add it as a secret for your Supabase edge functions.

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Access the Application**
   Open your browser and navigate to `http://localhost:8080`

## Database Schema

### Profiles Table
- Stores user profile information and nutrition goals
- Connected to Supabase auth.users via foreign key
- Includes fields for age, height, weight, and nutrition targets

### Food Entries Table
- Records individual meal entries
- Includes nutritional information (calories, protein, carbs, fat)
- Timestamps for meal tracking
- Associated with user profiles

## Security

- Row Level Security (RLS) policies ensure users can only access their own data
- Secure authentication flow handled by Supabase
- Protected API routes and database queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.