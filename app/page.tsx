"use client";

import type { Schema } from "@/amplify/data/resource";
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { generateClient } from "aws-amplify/data";
import React, { useState } from 'react';

const client = generateClient<Schema>({
  authMode: 'userPool'
});

export default function App() {
  const [todos, setTodos] = React.useState<Array<Schema["Todo"]["type"]>>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTodoContent, setNewTodoContent] = useState('');

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  function createTodo() {
    if (newTodoContent.trim()) {
      client.models.Todo.create({
        content: newTodoContent,
        isDone: false,
      });
      setNewTodoContent('');
      setOpenDialog(false);
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  React.useEffect(() => {
    listTodos();
  }, []);

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            您的待办事项
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            新建
          </Button>
        </Box>

        {todos.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            暂无待办事项，点击"新建"按钮添加
          </Typography>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1 }}>
            {todos.map((todo) => (
              <ListItem
                key={todo.id}
                secondaryAction={
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteTodo(todo.id)}
                    size="small"
                  >
                    删除
                  </Button>
                }
                sx={{
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <ListItemText primary={todo.content} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* 新建待办事项对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>新建待办事项</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            sx={{ mt: 1 }}
            label="待办事项内容"
            type="text"
            fullWidth
            variant="outlined"
            value={newTodoContent}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodoContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={createTodo} variant="contained">创建</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
