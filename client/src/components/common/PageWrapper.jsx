import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageMetadata, clearPageMetadata } from '../../redux/app/appSlice';

const PageWrapper = ({ title, description, children, className = '', actions }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageMetadata({ title, description }));
    return () => {
      dispatch(clearPageMetadata());
    };
  }, [title, description, dispatch]);

  return (
    <div className={`animate-slideUp ${className}`}>
      {(title || description || actions) && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            {title && (
              <h1 className="text-2xl md:text-3xl font-semibold text-(--text-primary) tracking-tight">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-(--text-secondary)">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default PageWrapper;
