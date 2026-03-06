import React from "react";

export default function useRefCallback<T>() {
  const ref = React.useRef<T | null>(null);
  const targetRef = React.useCallback((node: T | null) => {
    ref.current = node;
  }, []);
  return { ref, targetRef };
}
