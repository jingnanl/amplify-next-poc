import { defineFunction } from '@aws-amplify/backend';

export const sayHello = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'say-hello',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts',
  schedule: [
    // every sunday at midnight
    "every week",
    // every tuesday at 5pm
    "0 17 ? * 3 *",
    // every wednesday at 5pm
    "0 17 ? * 4 *",
    // every thursday at 5pm
    "0 17 ? * 5 *",
    // every friday at 5pm
    "0 17 ? * 6 *",
  ]
});