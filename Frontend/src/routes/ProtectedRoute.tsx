import type { RootState } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { setLastLocation } from '@/store/slice/authSlice';

export const ProtectedRoute: React.FC<{ allowedRoles: string }> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Store current location whenever it changes
    dispatch(setLastLocation(location.pathname + location.search));
  }, [location, dispatch]);

  if (!isAuthenticated) {
    console.log(`Unauthenticated, redirecting to /auth?path=login&from=${encodeURIComponent(location.pathname + location.search)}`);
    return (
      <Navigate
        to={`/auth?path=login&from=${encodeURIComponent(location.pathname + location.search)}`}
        state={{ from: location }}
        replace
      />
    );
  }

  if (user && !allowedRoles.includes(user.role)) {
    const redirectPath =
      user.role === 'admin'
        ? '/admin/dashboard'
        : '/user/dashboard';

    // 🧠 Prevent infinite redirect: if already on correct path, don't redirect again
    if (location.pathname !== redirectPath) {
      console.log(`Role mismatch, redirecting to ${redirectPath}`);
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <Outlet />;
};
