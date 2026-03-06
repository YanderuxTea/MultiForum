import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import IconMailMobileMessanger from "../icons/IconMailMobileMessanger";
import IconSettingsMobileMessanger from "../icons/IconSettingsMobileMessanger";

export default function FooterMobileMessanger() {
  const searchParams = useSearchParams();
  const isSettings = searchParams.get("settings");
  if (isSettings && isSettings !== "true") {
    notFound();
  }
  return (
    <div className="border-t border-neutral-300 dark:border-neutral-700 p-2.5 flex flex-row items-center justify-center gap-5">
      <Link
        href={"/messenger"}
        className={`transition-colors duration-300 ease-out font-medium flex flex-col items-center ${!isSettings ? "text-orange-500 dark:text-orange-600" : "text-black dark:text-white"}`}
      >
        <IconMailMobileMessanger isActive={!isSettings} />
        Сообщения
      </Link>

      <Link
        href={"/messenger?settings=true"}
        className={`transition-colors duration-300 ease-out font-medium flex flex-col items-center ${isSettings === "true" ? "text-orange-500 dark:text-orange-600" : "text-black dark:text-white"}`}
      >
        <IconSettingsMobileMessanger isActive={isSettings === "true"} />
        Настройки
      </Link>
    </div>
  );
}
