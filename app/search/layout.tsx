import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi Forum | Поиск",
  description:
    "Быстрый поиск по всем обсуждениям форума. Ищите конкретные темы, а также профили участников и опытных разработчиков по всем категориям.",
};
export default function LayoutSearch({ children }: { children: ReactNode }) {
  return <main className="w-full">{children}</main>;
}
