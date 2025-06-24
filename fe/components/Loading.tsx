export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>

      <p className="text-xl font-semibold text-blue-600 animate-pulse">
        Loading...
      </p>
    </div>
  );
}
