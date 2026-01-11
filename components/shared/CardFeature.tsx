export default function CardFeature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border p-5 rounded-2xl h-full w-full flex flex-col gap-2.5 border-orange-500/25 dark:border-orange-600/25 bg-orange-500/10 dark:bg-orange-600/10 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl shadow-orange-500/10 dark:shadow-orange-600/10">
      <h3 className="text-lg font-bold  text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <p className="text-neutral-800 dark:text-neutral-200 text-sm">
        {description}
      </p>
    </div>
  );
}
