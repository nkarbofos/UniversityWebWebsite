import React from 'react';
import { Card, CardContent, Link, Stack, Typography } from '@mui/material';
import type { LinkItem } from '../../services/types';

export default function ArchiveCard({ item }: { item: LinkItem }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">{item.linkName}</Typography>
          <Link href={item.githubPagesUrl} target="_blank" rel="noreferrer">
            {item.githubPagesUrl}
          </Link>
          <Typography variant="body2" color="text.secondary">
            userId: {item.userId}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
