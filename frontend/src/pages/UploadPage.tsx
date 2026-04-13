import React, { useMemo, useState } from 'react';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { useApi } from '../api/http';
import { linksService } from '../services/links';
import { useAuth } from '../state/AuthContext';

export default function UploadPage() {
  const { request } = useApi();
  const api = useMemo(() => linksService({ request }), [request]);
  const { userDb } = useAuth();

  const [linkName, setLinkName] = useState('');
  const [githubPagesUrl, setGithubPagesUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  return (
    <Stack spacing={2} maxWidth={520}>
      <Typography variant="h5">Загрузить проект</Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {ok ? <Alert severity="success">{ok}</Alert> : null}

      <TextField
        label="Название"
        value={linkName}
        onChange={(e) => setLinkName(e.target.value)}
      />
      <TextField
        label="GitHub Pages URL"
        value={githubPagesUrl}
        onChange={(e) => setGithubPagesUrl(e.target.value)}
      />

      <Button
        variant="contained"
        onClick={() => {
          void (async () => {
            setError(null);
            setOk(null);
            try {
              if (!userDb?.id)
                throw new Error(
                  'Нет DB-профиля: откройте /profile или завершите регистрацию',
                );
              await api.create({ userId: userDb.id, linkName, githubPagesUrl });
              setOk('Проект добавлен');
              setLinkName('');
              setGithubPagesUrl('');
            } catch (e) {
              setError(String(e));
            }
          })();
        }}
      >
        Отправить
      </Button>
    </Stack>
  );
}
