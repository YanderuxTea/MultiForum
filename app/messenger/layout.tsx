import { ReactNode } from "react";

export default function LayoutMessanger({ children }: { children: ReactNode }) {
  return (
    <main className="grow flex flex-col w-full lg:px-2.5 lg:h-screen">
      {children}
    </main>
  );
}
