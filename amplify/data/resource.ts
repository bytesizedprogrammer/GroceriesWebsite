import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({

  User: a
    .model({
      //userID: a.id().required(),
      email: a.email(),
      //password: a.string(),
      name: a.string(),
      sentFriendRequests: a.hasMany('FriendsList', 'userID'), // This points to userIDOne in FriendsList
      receivedFriendRequests: a.hasMany('FriendsList', 'userID2'), // This points to userIDTwo in FriendsList
      stores: a.hasMany('Store', 'userID') // if userID fails, just try doing id as a backup
    })
    .authorization((allow) => [allow.publicApiKey()]),

  FriendsList: a.model({
    userID: a.id(),
    userID2: a.id(),
    //nameOfPersonBehindUserID: a.string(),
    //nameOfPersonBehindUserID2: a.string(),
    userIDOne: a.belongsTo('User', 'userID'), // userIDOne in FriendsList points to userID in User
    userIDTwo: a.belongsTo('User', 'userID2'), // userIDTwo in FriendsList points to userID in User
    statusOfRequest: a.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
  })
  .authorization((allow) => [allow.publicApiKey()]),

  Store: a.model({ // Good to go
    //id: a.id().required(), // 
    userID: a.id().required(), // onCreation
    storeName: a.string(), // onCreation
    objects: a.hasMany('Storeobject', 'storeID'), // update
    forWhoseAccount: a.belongsTo('User', 'userID'), // onCreation
  })
  .authorization((allow) => [allow.publicApiKey()]),

  Storeobject: a.model({ // Good to go
    storeID: a.id().required(), // objectID
    objectName: a.string(),
    objectImage: a.string(),
    datetimeObjectWasAdded: a.datetime(),
    quantityOfProduct: a.integer(),
    addedByWhichUserID: a.belongsTo('Store', 'storeID'), // this should be renamed.  Copy same concept over to who added this.  AKA userID required and whichUserIsIt (this line btw is a function behind the scenes that does fetching)
  })
  .authorization(allow => [allow.publicApiKey()]),

});
export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
