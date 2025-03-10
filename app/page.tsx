"use client";

import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import React, { useState } from 'react';
import "./../app/app.css";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Container, 
  Paper, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ThemeProvider,
  createTheme,
  Drawer,
  ListItemIcon,
  ListItemButton
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Task as TaskIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Info as InfoIcon
} from '@mui/icons-material';

Amplify.configure(outputs);

const client = generateClient<Schema>();

// 创建自定义主题
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7551c2',
      light: '#9b7dd4',
      dark: '#5a3e9e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#646cff',
      light: '#8a91ff',
      dark: '#4b51cc',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

// 内部组件，在 Authenticator 上下文中使用 useAuthenticator
function TodoApp() {
  const [todos, setTodos] = React.useState<Array<Schema["Todo"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();
  const [openDialog, setOpenDialog] = useState(false);
  const [newTodoContent, setNewTodoContent] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  function createTodo() {
    if (newTodoContent.trim()) {
      client.models.Todo.create({
        content: newTodoContent,
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
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <TaskIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo 应用
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.signInDetails?.loginId}
            </Typography>
            <Tooltip title="账户设置">
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.signInDetails?.loginId?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                '& .MuiPaper-root': {
                  bgcolor: 'background.paper',
                  color: 'text.primary'
                }
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <Typography variant="body2">个人资料</Typography>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Typography variant="body2">设置</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={signOut}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">退出登录</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container component="main" maxWidth="sm" sx={{ mt: 10, mb: 4 }}>
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
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo.id)}>
                      <DeleteIcon />
                    </IconButton>
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
      </Container>
      
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

      {/* 左侧抽屉菜单 */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 250,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }
        }}
      >
        <Box
          sx={{ 
            width: '100%',
            pt: 2,
            pb: 2
          }}
          role="presentation"
          onClick={toggleDrawer}
        >
          <Box sx={{ px: 3, pb: 2, display: 'flex', alignItems: 'center' }}>
            <TaskIcon sx={{ mr: 1, color: 'primary.contrastText' }} />
            <Typography variant="h6" sx={{ color: 'primary.contrastText' }}>
              Todo 应用
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: 'primary.light' }} />
          <List sx={{ pt: 2 }}>
            <ListItemButton sx={{ '&:hover': { bgcolor: 'primary.dark' } }}>
              <ListItemIcon>
                <HomeIcon sx={{ color: 'primary.contrastText' }} />
              </ListItemIcon>
              <ListItemText 
                primary="首页" 
                primaryTypographyProps={{ 
                  sx: { color: 'primary.contrastText' } 
                }} 
              />
            </ListItemButton>
            <ListItemButton sx={{ '&:hover': { bgcolor: 'primary.dark' } }}>
              <ListItemIcon>
                <TaskIcon sx={{ color: 'primary.contrastText' }} />
              </ListItemIcon>
              <ListItemText 
                primary="待办事项" 
                primaryTypographyProps={{ 
                  sx: { color: 'primary.contrastText' } 
                }} 
              />
            </ListItemButton>
            <ListItemButton sx={{ '&:hover': { bgcolor: 'primary.dark' } }}>
              <ListItemIcon>
                <SettingsIcon sx={{ color: 'primary.contrastText' }} />
              </ListItemIcon>
              <ListItemText 
                primary="设置" 
                primaryTypographyProps={{ 
                  sx: { color: 'primary.contrastText' } 
                }} 
              />
            </ListItemButton>
            <ListItemButton sx={{ '&:hover': { bgcolor: 'primary.dark' } }}>
              <ListItemIcon>
                <InfoIcon sx={{ color: 'primary.contrastText' }} />
              </ListItemIcon>
              <ListItemText 
                primary="关于" 
                primaryTypographyProps={{ 
                  sx: { color: 'primary.contrastText' } 
                }} 
              />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default function App() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Authenticator>
          <TodoApp />
        </Authenticator>
      </ThemeProvider>
    </React.StrictMode>
  );
}
