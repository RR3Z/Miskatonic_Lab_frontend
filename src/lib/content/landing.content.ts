import { appRoutes } from "@/lib/routes/app-routes"

export const landingContent = {
  brand: {
    name: "Miskatonic Lab",
    alt: "Miskatonic Lab",
  },
  header: {
    signIn: "Войти",
  },
  caseFile: {
    registryCode: "MH-006",
    department: "Отделение частных сыщиков",
    stamp: "Закрыто",
    title: "Miskatonic Lab",
    summary:
      "Паранормальные события, необъяснимые аномалии, опытные и начинающие сыщики",
    meta: [
      { label: "Дело", value: "Маски Ньярлатхотепа" },
      { label: "Уровень доступа", value: "Наивысший" },
      { label: "Статус", value: "Материалы сверяются..." },
    ],
    investigatorsLabel: "Сыщики",
    investigators: [
      "Артур Нейтан Кэллахан",
      "Эдриан Джоэл Дювен",
      "Дороти Дотти Эйнсворт",
      "Рэймонд Рэй Андервуд",
    ],
    keeper: {
      label: "Руководитель дела",
      name: "Джексон Элиас",
      location: "США, Нью-Йорк",
      date: "07.07.1920",
    },
    actions: {
      openArchive: {
        label: "Открыть архив",
        href: appRoutes.characters,
      },
      createInvestigator: {
        label: "Создать сыщика",
        href: appRoutes.newCharacter,
      },
    },
  },
  marquee: {
    ariaLabel: "Возможности Miskatonic Lab",
    items: [
      "Лист персонажа",
      "Онлайн комнаты",
      "Симулятор бросков",
      "Хроника событий",
    ],
  },
  footer: {
    copyright: "© 2026 Miskatonic Lab",
    notice:
      "Все права защищены. Копирование, распространение и использование материалов без разрешения запрещены.",
    links: {
      telegram: {
        label: "Telegram",
        handle: "@RogeR3Z",
        href: "https://t.me/RogeR3Z",
      },
      github: {
        label: "GitHub",
        handle: "RR3Z",
        href: "https://github.com/RR3Z",
      },
    },
  },
} as const
