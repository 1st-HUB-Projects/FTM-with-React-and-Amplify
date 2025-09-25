import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// A simple schema with a single "Order" model.
const schema = a.schema({
  Order: a
    .model({
      // We are only defining the fields needed for the chart.
      orderId: a.string().required(),
      customerPhone: a.string(),
      orderDate: a.datetime().required(),
      status: a.enum([
        'ORDERED',
        'IN_PREPARATION',
        'PREPARED',
        'DELIVERED',
        'CANCELLED'
      ]),
      amount: a.float(),
    })
    .identifier(['orderId'])
    // This secondary index is the key to efficiently querying by status.
    .secondaryIndexes(index => [
      index('status').sortKeys(['orderDate']).queryField('ordersByStatus')
    ])
    // Only signed-in users can read the data.
    .authorization(allow => [
      allow.authenticated().to(['read', 'create', 'update']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

