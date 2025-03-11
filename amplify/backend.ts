import { defineBackend } from '@aws-amplify/backend';
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from './auth/resource.js';
import { data, generateHaikuFunction, MODEL_ID } from './data/resource.js';
import { sayHello } from './functions/say-hello/resource';
import { storage } from './storage/resource.js';

export const backend = defineBackend({
  auth,
  data,
  storage,
  generateHaikuFunction,
  sayHello,
});

backend.generateHaikuFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:*::foundation-model/${MODEL_ID}`,
    ],
  })
);

// Add custom resources
// const customResourceStack = backend.createStack('MyCustomResources');
// new sqs.Queue(customResourceStack, 'CustomQueue');
