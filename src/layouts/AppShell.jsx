import { Bell, BarChart3, BriefcaseBusiness, LayoutDashboard, LogOut, MessageSquare, Settings, Users } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import { useThemeStore } from '../features/settings/themeStore';
import { Button } from '../components/ui/Button';
import { useNotifications } from '../features/notifications/useNotifications';
import { useSocketPresence } from '../features/messages/useSocketPresence';

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/leads', label: 'Leads', icon: Users },
  { to: '/app/deals', label: 'Deals', icon: BriefcaseBusiness },
  { to: '/app/messages', label: 'Messages', icon: MessageSquare },
  { to: '/app/notifications', label: 'Notifications', icon: Bell },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'sales_manager'] },
  { to: '/app/team', label: 'Team', icon: Users, roles: ['admin', 'sales_manager'] },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export function AppShell() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { unreadCount, recent } = useNotifications();

  useSocketPresence();

  const visibleNavItems = navItems.filter((item) => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-slate-950 px-5 py-6 text-white">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-brand-500" />
            <div>
              <p className="font-semibold">AI Sales CRM</p>
              <p className="text-xs text-slate-400">Revenue workspace</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    {item.label}
                  </span>
                  {item.label === 'Notifications' && unreadCount > 0 ? (
                    <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs">{unreadCount}</span>
                  ) : null}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold">Workspace role</p>
            <p className="mt-1 text-sm text-slate-300">{user?.role?.replaceAll('_', ' ')}</p>
            <Button
              variant="ghost"
              className="mt-4 w-full justify-start bg-white/5 text-white hover:bg-white/10"
              onClick={() => navigate('/app/profile')}
            >
              Manage profile
            </Button>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:px-8">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
              <h1 className="text-xl font-semibold">{user?.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-800"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
                {recent?.[0]?.title || 'No new alerts'}
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </header>
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
