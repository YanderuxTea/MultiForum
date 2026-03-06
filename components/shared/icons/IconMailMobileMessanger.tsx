export default function IconMailMobileMessanger({
  isActive,
}: {
  isActive: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="fill-none w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
        className={`stroke-2 transition-colors duration-300 ease-out ${isActive ? "stroke-orange-500 dark:stroke-orange-600" : "stroke-black dark:stroke-white"}`}
        style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
      />
      <path
        d="M22 6L12 13L2 6"
        className={`stroke-2 transition-colors duration-300 ease-out ${isActive ? "stroke-orange-500 dark:stroke-orange-600" : "stroke-black dark:stroke-white"}`}
        style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
      />
    </svg>
  );
}
