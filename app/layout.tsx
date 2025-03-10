"use client";

import outputs from "@/amplify_outputs.json";
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import "@aws-amplify/ui-react/styles.css";
import {
  Home as HomeIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Task as TaskIcon
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  createTheme,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { Amplify } from "aws-amplify";
import { Inter } from "next/font/google";
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import "./app.css";

Amplify.configure(outputs);

const inter = Inter({ subsets: ["latin"] });

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

// 共享布局组件
function SharedLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuthenticator();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigateToHome = () => {
    router.push('/');
    setDrawerOpen(false);
  };

  const navigateToImages = () => {
    router.push('/images');
    setDrawerOpen(false);
  };

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
            {pathname === '/images' ? '图片管理' : 'Todo 应用'}
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
        >
          <Box sx={{ px: 3, pb: 2, display: 'flex', alignItems: 'center' }}>
            <TaskIcon sx={{ mr: 1, color: 'primary.contrastText' }} />
            <Typography variant="h6" sx={{ color: 'primary.contrastText' }}>
              应用菜单
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: 'primary.light' }} />
          <List sx={{ pt: 2 }}>
            <ListItemButton
              sx={{
                bgcolor: pathname === '/' ? 'primary.dark' : 'transparent',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
              onClick={navigateToHome}
            >
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
            <ListItemButton
              sx={{
                bgcolor: pathname === '/images' ? 'primary.dark' : 'transparent',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
              onClick={navigateToImages}
            >
              <ListItemIcon>
                <ImageIcon sx={{ color: 'primary.contrastText' }} />
              </ListItemIcon>
              <ListItemText
                primary="图片管理"
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

      {/* 主要内容区域，添加上边距以避免与AppBar重叠 */}
      <Box sx={{ pt: 28 }}>
        {children}
      </Box>
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <Authenticator>
            <SharedLayout>
              {children}
            </SharedLayout>
          </Authenticator>
        </ThemeProvider>
      </body>
    </html>
  );
}
