import { useEffect } from 'react';
import { AppRouter } from '../routes/AppRouter';
import { useAuthStore } from '../features/auth/authStore';
import { useThemeStore } from '../features/settings/themeStore';
import { ToastViewport } from '../components/shared/Toast';

export default function App() {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <AppRouter />
      <ToastViewport />
    </>
  );
}
