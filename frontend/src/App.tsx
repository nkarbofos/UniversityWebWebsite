import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArchiveHomePage from './pages/ArchiveHomePage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import MyLinksPage from './pages/MyLinksPage';
import UserProfilePage from './pages/UserProfilePage';
import { useAuth } from './state/AuthContext';

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Box textAlign="center">
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Загрузка...</Typography>
        </Box>
      </Box>
    );
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Container sx={{ mt: 3, mb: 4, maxWidth: 'xl' }}>
            <Routes>
              <Route path="/" element={<ArchiveHomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/upload"
                element={
                  <Protected>
                    <UploadPage />
                  </Protected>
                }
              />
              <Route
                path="/profile"
                element={
                  <Protected>
                    <ProfilePage />
                  </Protected>
                }
              />
              <Route
                path="/my-links"
                element={
                  <Protected>
                    <MyLinksPage />
                  </Protected>
                }
              />
              <Route
                path="/user/:userId"
                element={
                  <Protected>
                    <UserProfilePage />
                  </Protected>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
