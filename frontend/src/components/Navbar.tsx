import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Archive } from '@mui/icons-material';
import { useAuth } from '../state/AuthContext';

export default function Navbar() {
  const { user, userDb, logout } = useAuth();
  const nav = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <AppBar position="static">
      <Toolbar>
        <Archive sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Проекты
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button color="inherit" component={RouterLink} to="/">
            Архив
          </Button>
          {user ? (
            <Button color="inherit" component={RouterLink} to="/upload">
              Загрузить
            </Button>
          ) : null}

          {!user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Войти
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                component={RouterLink}
                to="/register"
                sx={{
                  borderColor: 'white',
                  '&:hover': { borderColor: 'white' },
                }}
              >
                Регистрация
              </Button>
            </>
          ) : (
            <>
              <Typography
                variant="body2"
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                {userDb ? `${userDb.firstName} ${userDb.lastName}` : user.email}
              </Typography>
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  cursor: 'pointer',
                  width: 36,
                  height: 36,
                }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                {(
                  userDb?.firstName?.[0] ??
                  user.email?.[0] ??
                  'U'
                ).toUpperCase()}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    void nav('/profile');
                  }}
                >
                  Профиль
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    void nav('/my-links');
                  }}
                >
                  Мои проекты
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    void logout()
                      .then(() => nav('/'))
                      .catch(() => {});
                  }}
                >
                  Выйти
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
