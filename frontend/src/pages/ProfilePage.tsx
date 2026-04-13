import React, { useState } from 'react';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { useApi } from '../api/http';
import { useAuth } from '../state/AuthContext';

export default function ProfilePage() {
  const { userDb } = useAuth();
  const { request } = useApi();

  const [firstName, setFirstName] = useState(userDb?.firstName ?? '');
  const [lastName, setLastName] = useState(userDb?.lastName ?? '');
  const [telegramUrl, setTelegramUrl] = useState(userDb?.telegramUrl ?? '');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  return (
    <Stack spacing={2} maxWidth={520}>
      <Typography variant="h5">Профиль</Typography>
      {!userDb ? (
        <Alert severity="warning">
          DB-профиль не найден. Завершите регистрацию.
        </Alert>
      ) : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      {ok ? <Alert severity="success">{ok}</Alert> : null}

      <TextField label="Email" value={userDb?.email ?? ''} disabled />
      <TextField
        label="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextField
        label="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <TextField
        label="Telegram URL (optional)"
        value={telegramUrl}
        onChange={(e) => setTelegramUrl(e.target.value)}
      />

      <Button
        variant="contained"
        onClick={() => {
          void (async () => {
            setError(null);
            setOk(null);
            try {
              if (!userDb?.id) throw new Error('Нет DB user id');
              await request(`/api/users/${userDb.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  firstName,
                  lastName,
                  telegramUrl: telegramUrl.trim() ? telegramUrl.trim() : null,
                }),
              });
              setOk('Сохранено');
            } catch (e) {
              setError(String(e));
            }
          })();
        }}
      >
        Сохранить
      </Button>
    </Stack>
  );
}
