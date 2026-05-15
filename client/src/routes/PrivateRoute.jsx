import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "../redux/auth/authSlice";

import Spinner from "../components/common/Spinner";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [isVerifying, setIsVerifying] = useState(!user);

  useEffect(() => {
    if (!user) {
      const verifyUser = async () => {
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch {
        } finally {
          setIsVerifying(false);
        }
      };

      verifyUser();
    } else {
      queueMicrotask(() => setIsVerifying(false));
    }
  }, [dispatch, user]);

  if (isLoading || isVerifying) {
    return <Spinner fullPage />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children || <Outlet />;
};

export default PrivateRoute;
