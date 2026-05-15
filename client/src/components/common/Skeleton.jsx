const Skeleton = ({ className = '', variant = 'rect' }) => {
  const baseClass = 'animate-pulse bg-(--border-subtle) rounded';

  const variants = {
    rect: '',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  const variantClass = variants[variant] || '';

  return (
    <div className={`${baseClass} ${variantClass} ${className}`} />
  );
};

export const SkeletonRow = ({ columns = 7 }) => (
  <tr className="border-b border-(--border-subtle)">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="py-4 px-6">
        <Skeleton className={`h-4 ${i === 0 ? 'w-24' : i === columns - 1 ? 'w-8 mx-auto' : 'w-20 ml-auto'}`} />
      </td>
    ))}
  </tr>
);

export const SkeletonStatCard = () => (
  <div className="p-5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated)">
    <div className="flex items-start justify-between mb-3">
      <Skeleton className="w-9 h-9 rounded-lg" />
      <Skeleton className="w-14 h-5 rounded-full" />
    </div>
    <Skeleton className="h-7 w-24 mb-1" />
    <Skeleton className="h-4 w-20" />
  </div>
);

export const SkeletonChart = ({ height = 'h-96' }) => (
  <div className={`${height} flex flex-col gap-4 p-4`}>
    <Skeleton className="h-4 w-32" />
    <div className="flex-1 rounded-lg bg-(--surface-elevated) border border-(--border-subtle) flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 10, columns = 7 }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-(--border-subtle)">
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="py-4 px-6">
              <Skeleton className={`h-3 ${i === 0 ? 'w-14' : 'w-16 ml-auto'}`} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

export default Skeleton;
