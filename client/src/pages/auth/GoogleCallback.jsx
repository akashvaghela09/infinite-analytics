import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../redux/auth/authSlice";
import Spinner from "../../components/common/Spinner";

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await dispatch(getCurrentUser()).unwrap();
        navigate("/dashboard");
      } catch (error) {
        navigate("/login");
      }
    };

    verifyUser();
  }, [dispatch, navigate]);

  return <Spinner fullPage />;
};

export default GoogleCallback;
