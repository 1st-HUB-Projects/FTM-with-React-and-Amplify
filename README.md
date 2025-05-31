# Fish Tank Manager

An example web application for managing aquariums and fish tanks, built with React, TypeScript, and AWS Amplify.

This is used as part of my series of Medium articles that
introduce this technology stack.

## Features

- **User Authentication**: Secure login and user management via AWS Cognito
- **Tank Management**: Create and manage different types of aquariums
- **Tank Types**: Support for Freshwater, Saltwater, Tropical, and Arctic tanks
- **Responsive Design**: Built with Tailwind CSS for a mobile-friendly experience

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Authentication**: AWS Amplify Authentication
- **Backend**: AWS Amplify (GraphQL API, Lambda Functions)
- **Database**: AWS DynamoDB

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- AWS Account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd my-react-app-with-amplify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize Amplify locally (still uses AWS cloud services and may incur costs):
   ```bash
   npx ampx sandbox
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
my-react-app-with-amplify/
├── amplify/               # AWS Amplify configuration and backend code
│   ├── auth/              # Authentication configuration
│   ├── data/              # Data models and schema
│   └── functions/         # Lambda functions
├── public/                # Static assets
├── src/
│   ├── assets/            # Frontend assets
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
└── ...
```

## Data Models

### Aquarium Model

The application uses the following data model for tanks:

```typescript
{
  tank: string;           // Name of the tank
  tankType: TankType;     // One of: Freshwater, Saltwater, Tropical, Arctic
  fish: string;           // Fish information
}
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Deployment

This application can be deployed using AWS Amplify:

```bash
npx ampx push
npx ampx publish
```
## Cleaning up

This application can be cleaned up to save costs using:

```bash
npx ampx sandbox delete
```
You may need any production deployment to be deleted manually.

## License

This project is licensed under the MIT License - see the LICENSE file for details.