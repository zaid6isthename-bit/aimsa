export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B5AFA3]/30 border-t-[#D92525]" />
    </div>
  );
}
