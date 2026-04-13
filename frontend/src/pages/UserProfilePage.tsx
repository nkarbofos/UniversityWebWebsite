import React from 'react';
import { Alert, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function UserProfilePage() {
  const { userId } = useParams();
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Профиль пользователя</Typography>
      <Alert severity="info">Просмотр пользователя {userId}</Alert>
    </Stack>
  );
}
