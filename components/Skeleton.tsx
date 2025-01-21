interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton = ({ width = 'full', height = '20', className = '' }: SkeletonProps) => {
  return (
    <div 
      className={`bg-gray-300 rounded animate-pulse ${
        width.startsWith('w-') ? width : `w-${width}`
      } ${
        height.startsWith('h-') ? height : `h-${height}`
      } ${className}`}
    />
  );
};

export const MovieSkeleton = () => (
  <div className="bg-gray-200 rounded p-4 shadow animate-pulse">
    <Skeleton height="64" className="mb-4" />
    <Skeleton width="3/4" height="8" className="mb-4" />
    <Skeleton width="1/2" height="4" className="mb-2" />
    <Skeleton width="1/3" height="4" className="mb-4" />
    {/* <Skeleton height="20" /> */}
  </div>
);