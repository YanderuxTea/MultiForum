export default function UnreadCheckMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      className={"fill-none w-4 h-4"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 4L6.4375 12L3 8.36364"
        className={"stroke-1 stroke-orange-500 dark:stroke-orange-600"}
        style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
      />
    </svg>
  );
}
