import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';
import { useApi } from '../../api/http';
import { linksService } from '../../services/links';
import type { LinkItem } from '../../services/types';
import ArchiveCard from './ArchiveCard';
import type { ArchiveFiltersValue } from './ArchiveFilters';

export default function ArchiveList({
  filters,
}: {
  filters: ArchiveFiltersValue;
}) {
  const { request } = useApi();
  const api = useMemo(() => linksService({ request }), [request]);
  const [items, setItems] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.list({ page: 1, pageSize: 20, ...filters });
        setItems(data);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [api, filters]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box
      sx={{
        width: '100%',
        mt: { xs: 2, sm: 4 },
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2,1fr)',
          md: 'repeat(3,1fr)',
          lg: 'repeat(4,1fr)',
        },
        gap: { xs: 2, sm: 3 },
      }}
    >
      {items.map((x) => (
        <ArchiveCard key={x.id} item={x} />
      ))}
    </Box>
  );
}
