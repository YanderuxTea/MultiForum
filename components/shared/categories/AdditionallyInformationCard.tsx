import { IAdditionalInformation } from "@/data/additionallyInformation";
import { JSX } from "react";

export default async function AdditionallyInformationCard({
  props,
  content,
}: {
  props: IAdditionalInformation;
  content: JSX.Element;
}) {
  return (
    <div className="flex flex-col bg-white dark:bg-[#212121] rounded-md border border-neutral-300 dark:border-neutral-700 shadow-md shadow-black/25 dark:shadow-neutral-700/25">
      <div className="dark:bg-orange-600 text-neutral-900 dark:text-neutral-100 font-medium rounded-t-md px-2.5 py-3 border-b border-neutral-300 dark:border-neutral-700">
        <p className="font-bold">{props.title}</p>
      </div>
      <div className="text-center text-neutral-600 dark:text-neutral-400">
        {content}
      </div>
    </div>
  );
}
