"use client";

import { FileUploader, StorageImage } from '@aws-amplify/ui-react-storage';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid2 as Grid,
  Paper,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

// 自定义图片组件，带有加载失败的回退显示
function ImageWithFallback({ fileKey }: { fileKey: string }) {
  const [hasError, setHasError] = useState(false);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
      <StorageImage
        accessLevel="private"
        imgKey={fileKey}
        alt="用户上传的图片"
        style={{
          width: '100%',
          height: 200,
          objectFit: 'cover',
          display: hasError ? 'none' : 'block'
        }}
        onError={() => setHasError(true)}
      />
      {hasError && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f0f0f0',
            color: '#666'
          }}
        >
          无图片
        </Box>
      )}
    </Box>
  );
}

export default function ImagesPage() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 处理文件上传完成事件
  const handleUploadSuccess = async (event: any) => {
    console.log('Upload success:', event);
    // 刷新文件列表
    fetchUserImages();
  };

  // 获取用户上传的图片列表
  const fetchUserImages = async () => {
    try {
      setIsLoading(true);
      // 使用 Amplify Storage 列出用户私有目录中的文件
      const { list } = await import('aws-amplify/storage');
      const result = await list({
        prefix: 'private/',
        options: {
          accessLevel: 'private'
        }
      });

      const fileKeys = result.items.map((item: { key: string }) => item.key);
      setUploadedFiles(fileKeys);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 组件加载时获取图片列表
  useEffect(() => {
    fetchUserImages();
  }, []);

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
          上传图片
        </Typography>

        <FileUploader
          accessLevel="private"
          path="private/"
          acceptedFileTypes={['image/*']}
          onUploadSuccess={handleUploadSuccess}
          maxFileCount={10}
          components={{
            Container: ({ children }: { children: React.ReactNode }) => (
              <Box sx={{ border: '2px dashed #7551c2', borderRadius: 2, p: 3 }}>
                {children}
              </Box>
            )
          }}
        />
      </Paper>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
          我的图片
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : uploadedFiles.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            暂无图片，请上传图片
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {uploadedFiles.map((fileKey) => (
              <Grid item xs={12} sm={6} md={4} key={fileKey}>
                <Card sx={{ height: '100%' }}>
                  {/* Custom image component with fallback */}
                  <ImageWithFallback fileKey={fileKey} />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {fileKey.split('/').pop()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
}
