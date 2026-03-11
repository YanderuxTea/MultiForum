export default function ReadCheckMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={"fill-none w-4 h-4"}
    >
      <path
        d="M12 4L4.4375 12L1 8.36364"
        className={"stroke-1 stroke-orange-500 dark:stroke-orange-600"}
        style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
      />
      <path
        d="M15 4L7.4375 12L7 11.5"
        className={"stroke-1 stroke-orange-500 dark:stroke-orange-600"}
        style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
      />
    </svg>
  );
}
