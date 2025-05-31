import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { getGreeting } from '../functions/greetings/getGreeting';

const TankTypeValues = ['Freshwater', 'Saltwater', 'Tropical', 'Arctic'] as const;
type TankType = (typeof TankTypeValues)[number];

const schema = a.schema({
  Aquarium: a.model({
      tank: a.string().required(),
      tankType: a.string()
        .required()
        .validate(value => {
          const stringValue: string = String(value)
          return TankTypeValues.includes(stringValue as TankType)
            ? { valid: true }
            : { valid: false, message: `tankType must be one of: ${TankTypeValues.join(', ')}` }
        }),      
        fish: a.string(),
    })
    // .identifier(['id', 'tankType']) // as id is autogenerates, this primary key cannot be created
    .authorization(allow => [allow.authenticated()])
    .secondaryIndexes((index) => [
      index('tankType').sortKeys(['tank']) // tankType is the Partition Key - note that the GSI cannot be named but is referred to its index position
    ]),

  GetGreeting: a
    .query()
    .arguments({
      context: a.string(),
    })
    .returns(a.string())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(getGreeting)),
});

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool'
  }
});
