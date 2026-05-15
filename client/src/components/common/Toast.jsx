import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { removeToast } from '../../redux/app/appSlice';

export const Toast = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.app.toasts);
  const timeoutsRef = useRef(new Map());

  useEffect(() => {
    toasts.forEach((toast) => {
      if (!timeoutsRef.current.has(toast.id)) {
        const id = setTimeout(() => {
          dispatch(removeToast(toast.id));
          timeoutsRef.current.delete(toast.id);
        }, 4000);
        timeoutsRef.current.set(toast.id, id);
      }
    });

    return () => {
      timeoutsRef.current.forEach((timerId) => clearTimeout(timerId));
      timeoutsRef.current.clear();
    };
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-(--success)" strokeWidth={1.5} />,
    error: <AlertCircle className="w-5 h-5 text-(--error)" strokeWidth={1.5} />,
    info: <Info className="w-5 h-5 text-(--accent-400)" strokeWidth={1.5} />
  };

  const borderColors = {
    success: 'border-(--success)/30',
    error: 'border-(--error)/30',
    info: 'border-(--accent-500)/30'
  };

  const bgColors = {
    success: 'bg-(--success)/5',
    error: 'bg-(--error)/5',
    info: 'bg-(--accent-500)/5'
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            animate-slideUp
            ${bgColors[toast.type]}
            border ${borderColors[toast.type]}
            rounded-lg shadow-lg
            p-4 flex items-start gap-3 min-w-[300px] max-w-[400px]
            backdrop-blur-xl
          `}
        >
          {iconMap[toast.type]}
          <p className="text-(--text-primary) text-sm flex-1">{toast.message}</p>
          <button
            onClick={() => dispatch(removeToast(toast.id))}
            className="text-(--text-muted) hover:text-(--text-secondary) transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
