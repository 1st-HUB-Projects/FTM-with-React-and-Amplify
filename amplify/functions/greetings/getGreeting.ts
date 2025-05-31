import { defineFunction } from '@aws-amplify/backend';

export const getGreeting = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'get-greeting',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './getGreetingHandler.ts'
});