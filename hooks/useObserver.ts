import React from "react";

export default function useObserver({
  container,
  margin,
}: {
  margin: number;
  container: React.RefObject<HTMLDivElement | null>;
}) {
  const observer = React.useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const targetRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      if (!node) {
        return;
      }
      observer.current = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { root: container.current, rootMargin: `${margin}px` },
      );
      observer.current.observe(node);
    },
    [container, margin],
  );
  return { isVisible, targetRef };
}
