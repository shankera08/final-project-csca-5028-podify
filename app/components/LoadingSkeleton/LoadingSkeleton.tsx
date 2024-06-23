import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingSkeleton({
  message,
  baseColor,
}: {
  message: string;
  baseColor: string;
}) {
  return (
    <>
      <div>
        <h2>{message}</h2>
      </div>
      <SkeletonTheme height={50} baseColor={baseColor} highlightColor="#444">
        <p>
          <Skeleton count={50} />
        </p>
      </SkeletonTheme>
    </>
  );
}
