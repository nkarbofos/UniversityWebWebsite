import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Stack, Typography } from '@mui/material';
import { useApi } from '../api/http';
import { linksService } from '../services/links';
import { useAuth } from '../state/AuthContext';
import ArchiveCard from '../components/archive/ArchiveCard';
import type { LinkItem } from '../services/types';

export default function MyLinksPage() {
  const { userDb } = useAuth();
  const { request } = useApi();
  const api = useMemo(() => linksService({ request }), [request]);

  const [items, setItems] = useState<LinkItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        if (!userDb?.id) throw new Error('DB profile missing');
        const data = await api.list({
          page: 1,
          pageSize: 50,
          userId: userDb.id,
        });
        setItems(data);
      } catch (e) {
        setError(String(e));
      }
    })();
  }, [api, userDb?.id]);

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Мои проекты</Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {items.map((x) => (
        <ArchiveCard key={x.id} item={x} />
      ))}
    </Stack>
  );
}
