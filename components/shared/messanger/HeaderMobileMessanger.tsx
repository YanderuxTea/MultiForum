import Link from "next/link";

export default function HeaderMobileMessanger() {
  return (
    <div className="border-b border-neutral-300 dark:border-neutral-700 p-2.5 flex z-10 bg-white dark:bg-[#212121]">
      <Link
        href={"/"}
        className="uppercase font-bold text-2xl text-center w-full"
      >
        Multi Forum
      </Link>
    </div>
  );
}
