const SkeletonCard = () => {
  return (
    <div className="col-span-1 shadow-md p-3 rounded-xl relative bg-white dark:bg-gray-800 overflow-hidden">
      {/* CSS Shimmer Keyframe Styles */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shimmer-bg {
          background: linear-gradient(
            90deg,
            #f3f4f6 25%,
            #e5e7eb 37%,
            #f3f4f6 63%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        .dark .shimmer-bg {
          background: linear-gradient(
            90deg,
            #374151 25%,
            #4b5563 37%,
            #374151 63%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>

      <div className="flex flex-col gap-3 w-full">
        {/* Image Aspect Square Placeholder */}
        <div className="aspect-square w-full rounded-xl shimmer-bg"></div>

        {/* Title Placeholder */}
        <div className="h-5 w-3/4 rounded-md shimmer-bg mt-1"></div>

        {/* Category Placeholder */}
        <div className="h-4 w-1/2 rounded-md shimmer-bg"></div>

        {/* Quantity Placeholder */}
        <div className="h-4 w-2/5 rounded-md shimmer-bg"></div>

        {/* Price Placeholder */}
        <div className="h-5 w-1/3 rounded-md shimmer-bg"></div>
      </div>

      {/* Cart Icon Circle Placeholder */}
      <div className="absolute top-3 right-3 w-9 h-9 rounded-full shimmer-bg border border-white dark:border-gray-700"></div>
    </div>
  );
};

export default SkeletonCard;
