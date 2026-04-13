import React, { useCallback, useState } from 'react';
import { Box } from '@mui/material';
import ArchiveFilters, {
  type ArchiveFiltersValue,
} from '../components/archive/ArchiveFilters';
import ArchiveList from '../components/archive/ArchiveList';

export default function ArchiveHomePage() {
  const [filters, setFilters] = useState<ArchiveFiltersValue>({});
  const onChange = useCallback((v: ArchiveFiltersValue) => setFilters(v), []);

  return (
    <Box sx={{ width: '100%' }}>
      <ArchiveFilters value={filters} onChange={onChange} />
      <ArchiveList filters={filters} />
    </Box>
  );
}
