import { Skeleton } from "@/components/ui/skeleton";

export default function BoardLoading() {
  return (
    <div className="h-full p-8">
      <div className="flex items-center gap-x-2 mb-8">
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex flex-col gap-y-3">
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2">
              {[...Array(3)].map((_, taskIndex) => (
                <div
                  key={taskIndex}
                  className="p-3 bg-white rounded-md shadow-sm"
                >
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 