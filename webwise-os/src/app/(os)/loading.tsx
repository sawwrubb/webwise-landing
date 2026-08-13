import { SkeletonList } from "@/components/states";

export default function Loading() {
  return (
    <div className="p-6">
      <div className="skel mb-4 h-8 w-48" />
      <SkeletonList />
    </div>
  );
}
