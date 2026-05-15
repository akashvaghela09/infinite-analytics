import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/auth/authSlice';
import { setMobileSidebarOpen, toggleMobileSidebar } from '../../redux/app/appSlice';
import Avatar from '../common/Avatar';
import {
  LayoutDashboard,
  Coins,
  CloudSun,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const mobileSidebarOpen = useSelector((state) => state.app.mobileSidebarOpen);

  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/coins', label: 'Coins', icon: Coins },
    { path: '/weather', label: 'Weather', icon: CloudSun },
  ];

  const userNavItems = [
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavClick = () => {
    dispatch(setMobileSidebarOpen(false));
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <Link
        to={item.path}
        onClick={handleNavClick}
        className={`
          group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
          ${active
            ? 'bg-(--bg-elevated) text-(--accent-400)'
            : 'text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary)'
          }
        `}
      >
        <div className={`
          relative flex items-center justify-center
          ${active ? 'after:absolute after:inset-0 after:bg-(--accent-500)/20 after:rounded-lg after:blur-sm' : ''}
        `}>
          <Icon
            className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
              active ? 'text-(--accent-400)' : 'text-(--text-muted) group-hover:text-(--text-secondary)'
            }`}
            strokeWidth={1.5}
          />
        </div>
        <span className="font-medium text-sm tracking-wide">
          {item.label}
        </span>
        {active && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-(--accent-400) shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <>
      <div className="h-16 flex items-center px-4 border-b border-(--border-subtle)">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-linear-to-br from-(--accent-500) to-(--accent-700) flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <span className="text-white font-bold text-sm font-display">IA</span>
          </div>
          <div className="flex flex-col">
            <span className="text-(--text-primary) font-semibold text-sm tracking-tight">Infinite</span>
            <span className="text-(--text-muted) text-[10px] tracking-widest uppercase">Analytics</span>
          </div>
        </Link>
      </div>
      <div className="flex-1 py-4 px-2 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-medium text-(--text-muted) uppercase tracking-wider">
          Main
        </div>
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        <div className="px-3 mt-6 mb-2 text-[10px] font-medium text-(--text-muted) uppercase tracking-wider">
          Account
        </div>
        <nav className="space-y-1 mt-4">
          {userNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-(--border-subtle)">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary) transition-all duration-200 mb-3"
        >
          <Avatar 
            src={user?.photo} 
            name={user?.name} 
            size="sm"
            className="shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-(--text-primary) truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-(--accent-400) truncate hover:underline cursor-pointer">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-(--error) hover:bg-(--error)/10 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => dispatch(toggleMobileSidebar())}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-(--bg-secondary) border border-(--border-subtle) text-(--text-secondary) hover:text-(--text-primary) transition-colors"
      >
        {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => dispatch(setMobileSidebarOpen(false))}
        />
      )}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 bg-(--bg-secondary) border-r border-(--border-subtle) z-40
          flex flex-col w-(--sidebar-width)
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-transform duration-300 ease-out
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
