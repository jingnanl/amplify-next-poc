import { defineStorage } from "@aws-amplify/backend";

/**
 * Define and configure your storage resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/storage/
 */
export const storage = defineStorage({
  name: "userImages",
  access: (allow) => ({
    // 允许用户读取、写入和删除自己文件夹中的文件
    'private/{entity_id}/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ]
  }),
});
