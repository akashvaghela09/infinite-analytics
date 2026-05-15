import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRouter from './routes/AppRouter';
import AppShell from './components/layout/AppShell';
import { Toast } from './components/common/Toast';
import { setNetworkStatus } from './redux/app/appSlice';
import './index.css';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleOnline = () => dispatch(setNetworkStatus('online'));
    const handleOffline = () => dispatch(setNetworkStatus('offline'));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  return (
    <>
      <Toast />
      {user ? (
        <AppShell>
          <AppRouter />
        </AppShell>
      ) : (
        <AppRouter />
      )}
    </>
  );
}

export default App;
