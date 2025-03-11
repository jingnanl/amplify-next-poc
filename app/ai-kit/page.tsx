"use client";

import { Authenticator, Button, Divider, Flex, Loader, Text, TextAreaField, View } from "@aws-amplify/ui-react";
import { AIConversation } from '@aws-amplify/ui-react-ai';
import { Box, Container, Paper, Tab, Tabs, Typography } from '@mui/material';
import * as React from 'react';
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import { createAIHooks } from "@aws-amplify/ui-react-ai";

// Define the recipe type
interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string;
}

// 创建客户端
export const client = generateClient<Schema>({ 
  authMode: "userPool"
});

// 创建 AI 钩子
export const { useAIConversation, useAIGeneration } = createAIHooks(client);

export default function AIKit() {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          AI 工具箱
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="AI 对话" />
          <Tab label="食谱生成器" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && <ConversationComponent />}
          {tabValue === 1 && <RecipeGeneratorComponent />}
        </Box>
      </Paper>
    </Container>
  );
}

function ConversationComponent() {
  // 使用 useAIConversation 钩子
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat');

  return (
    <Box sx={{ height: '500px' }}>
      <Authenticator>
        <AIConversation
          messages={messages}
          isLoading={isLoading}
          handleSendMessage={handleSendMessage}
        />
      </Authenticator>
    </Box>
  );
}

function RecipeGeneratorComponent() {
  const [description, setDescription] = React.useState("");
  const [{ data, isLoading }, generateRecipe] = useAIGeneration("generateRecipe");

  const handleClick = async () => {
    generateRecipe({ description });
  };

  // Cast data to Recipe type for type safety
  const recipeData = data as Recipe | undefined;

  return (
    <Flex direction="column" gap="1rem">
      <Flex direction="column" gap="1rem">
        <TextAreaField
          autoResize
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          label="描述您想要的食谱"
          placeholder="例如：一道简单的素食意大利面，带有番茄和香草"
        />
        <Button
          onClick={handleClick}
          variation="primary"
          isDisabled={!description.trim() || isLoading}
        >
          生成食谱
        </Button>
      </Flex>

      {isLoading ? (
        <Loader variation="linear" />
      ) : recipeData ? (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f7', borderRadius: 1 }}>
          <Text fontWeight="bold" fontSize="1.2rem">{recipeData.name}</Text>
          <Divider />

          <Text fontWeight="bold" marginTop="1rem">食材：</Text>
          <View as="ul">
            {recipeData.ingredients?.map((ingredient: string) => (
              <View as="li" key={ingredient}>
                {ingredient}
              </View>
            ))}
          </View>

          <Text fontWeight="bold" marginTop="1rem">步骤：</Text>
          <Text>{recipeData.instructions}</Text>
        </Box>
      ) : null}
    </Flex>
  );
}
