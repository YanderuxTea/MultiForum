export default function LoadingSendMessage({
  disabled,
}: {
  disabled: boolean;
}) {
  return (
    <div
      className={
        "w-6.25 shrink-0 aspect-square overflow-clip relative animate-spin"
      }
    >
      <div
        className={`absolute z-1 inset-1 rounded-full ${disabled ? "bg-neutral-300 dark:bg-neutral-600" : "bg-neutral-200 dark:bg-neutral-700"}`}
      ></div>
      <div
        className={
          "absolute z-0 bg-conic from-transparent to-neutral-600 dark:to-white  inset-0 rounded-full"
        }
      ></div>
    </div>
  );
}
