import CardFeature from "@/components/shared/CardFeature";
import StubHeader from "@/components/shared/stubs/StubHeader";
import StubUnderHeader from "@/components/shared/stubs/StubUnderHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi Forum | О нас",
  description:
    "Multi Forum - современный форум для общения, обмена опытом и обсуждения тем в удобном и безопасном формате.",
};
export default function Page() {
  const cardFeature: { title: string; description: string }[] = [
    {
      title: "Удобство",
      description:
        "Интерфейс продуман до мелочей, чтобы пользователи могли сосредоточиться на общении, а не на поиске нужных кнопок.",
    },
    {
      title: "Безопасность",
      description:
        "Современные подходы к защите аккаунтов, сессий и данных пользователей являются приоритетом проекта.",
    },
    {
      title: "Сообщество",
      description:
        "Форум развивается вокруг людей, их интересов и желания делиться знаниями и опытом.",
    },
  ];
  return (
    <main className="px-2.5 py-10 w-full flex flex-col items-center grow bg-neutral-100 dark:bg-[#181818] text-justify">
      <StubHeader />
      <StubUnderHeader />
      <div className="flex flex-col gap-15 max-w-300">
        <article className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            О проекте
          </h1>
          <p className="text-neutral-800 dark:text-neutral-200">
            Multi Forum - это современная платформа для общения и обмена опытом,
            созданная с акцентом на удобство, безопасность и комфорт
            пользователей.
          </p>
        </article>
        <article className="flex flex-col gap-5">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Зачем существует Multi Forum
          </h2>
          <p className="text-neutral-800 dark:text-neutral-200">
            Проект был создан как альтернатива перегруженным форумам с
            устаревшим интерфейсом. Здесь нет лишнего шума - только продуманные
            функции и приятное взаимодейтсвие.
          </p>
        </article>
        <div className="flex flex-col gap-5">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Основные принципы
          </h2>
          <div className="grid gap-5 lg:grid-cols-3 auto-rows-fr">
            {cardFeature.map((card) => {
              return (
                <CardFeature
                  key={card.title}
                  title={card.title}
                  description={card.description}
                />
              );
            })}
          </div>
        </div>
        <article className="flex flex-col gap-5">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Развитие проекта
          </h2>
          <p className="text-neutral-800 dark:text-neutral-200">
            Multi Forum развивается постепенно. Проект создается и
            поддерживается одним разработчиком с вниманием к деталям, качеству и
            пользовательскому опыту.
          </p>
        </article>
      </div>
    </main>
  );
}
