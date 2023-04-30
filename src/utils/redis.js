import { AggregateSteps, AggregateGroupByReducers, createClient, SchemaFieldTypes } from "redis";

const client = createClient();

client.on("ready", () => console.log("Redis Client Connected"));
client.on("error", (err) => console.log("Redis Client Error", err));

connect();
createUserIndex();

async function connect() {
  if (!client.isOpen) {
    await client.connect();
  }
}

async function createUserIndex() {
  try {
    await client.ft.create(
      "idx:users",
      {
        "$.name": {
          type: SchemaFieldTypes.TEXT,
          sortable: true,
        },
        "$.email": {
          type: SchemaFieldTypes.TAG,
          AS: "email",
        },
      },
      {
        ON: "JSON",
        PREFIX: "user:",
      }
    );
  } catch (e) {
    if (e.message === "Index already exists") {
      console.log("Index exists already, skipped creation.");
    } else {
      // Something went wrong, perhaps RediSearch isn't installed...
      console.error(e);
      process.exit(1);
    }
  }
}

export default client;
