import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true
  },
  userAttributes: {
    givenName: {
      mutable: false,
      required: true
    },
    familyName: {
      mutable: false,
      required: true
    },
  }
});