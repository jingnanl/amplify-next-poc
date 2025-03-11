"use client";

import type { Schema } from "@/amplify/data/resource";
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import outputs from "@/amplify_outputs.json";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from '@mui/material';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function HaikuGenerator() {
  const [prompt, setPrompt] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendPrompt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { data, errors } = await client.queries.generateHaiku({
        prompt
      });

      if (!errors) {
        setAnswer(data);
        setPrompt('');
      } else {
        console.log(errors);
        setAnswer('生成俳句时出错，请重试。');
      }
    } catch (error) {
      console.error('Error generating haiku:', error);
      setAnswer('生成俳句时出错，请重试。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          俳句生成器
        </Typography>
        
        <form onSubmit={sendPrompt}>
          <TextField
            fullWidth
            label="输入提示词..."
            variant="outlined"
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
            sx={{ mb: 2 }}
            disabled={isLoading}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={!prompt.trim() || isLoading}
            sx={{ mb: 3 }}
          >
            {isLoading ? '生成中...' : '生成俳句'}
          </Button>
        </form>
        
        {answer && (
          <Box 
            sx={{ 
              p: 3, 
              bgcolor: 'background.default', 
              borderRadius: 1,
              whiteSpace: 'pre-wrap',
              fontFamily: '"Noto Serif", serif',
              textAlign: 'center'
            }}
          >
            <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {answer}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
