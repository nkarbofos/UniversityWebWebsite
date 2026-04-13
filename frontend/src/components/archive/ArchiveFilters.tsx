import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useApi } from '../../api/http';
import { tagsService } from '../../services/tags';
import { coursesService } from '../../services/courses';
import type { Course, Tag } from '../../services/types';

export type ArchiveFiltersValue = {
  userId?: string;
  tagId?: string;
  courseId?: string;
};

export default function ArchiveFilters(props: {
  value: ArchiveFiltersValue;
  onChange: (v: ArchiveFiltersValue) => void;
}) {
  const { request } = useApi();
  const tagsApi = useMemo(() => tagsService({ request }), [request]);
  const coursesApi = useMemo(() => coursesService({ request }), [request]);

  const [tags, setTags] = useState<Tag[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    void tagsApi
      .list()
      .then(setTags)
      .catch(() => setTags([]));
    void coursesApi
      .list()
      .then(setCourses)
      .catch(() => setCourses([]));
  }, [tagsApi, coursesApi]);

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="User ID (UUID)"
          value={props.value.userId ?? ''}
          onChange={(e) =>
            props.onChange({
              ...props.value,
              userId: e.target.value || undefined,
            })
          }
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Tag</InputLabel>
          <Select
            label="Tag"
            value={props.value.tagId ?? ''}
            onChange={(e) =>
              props.onChange({
                ...props.value,
                tagId: String(e.target.value) || undefined,
              })
            }
          >
            <MenuItem value="">Any</MenuItem>
            {tags.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Course</InputLabel>
          <Select
            label="Course"
            value={props.value.courseId ?? ''}
            onChange={(e) =>
              props.onChange({
                ...props.value,
                courseId: String(e.target.value) || undefined,
              })
            }
          >
            <MenuItem value="">Any</MenuItem>
            {courses.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}
