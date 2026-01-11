import god from "@/components/shared/svg/Code_God.svg";
import CTO from "@/components/shared/svg/CTO.svg";
import archt from "@/components/shared/svg/Architect.svg";
import tl from "@/components/shared/svg/Team_Lead.svg";
import senior from "@/components/shared/svg/Senior.svg";
import middle from "@/components/shared/svg/Middle.svg";
import coder from "@/components/shared/svg/Coder.svg";
import junior from "@/components/shared/svg/Junior.svg";
import trainee from "@/components/shared/svg/Trainee.svg";
import hw from "@/components/shared/svg/Hello_World.svg";

export default interface IRank {
  countMess: number;
  icon: string;
  title: string;
  lvl: number;
}
export const ranks: IRank[] = [
  {
    countMess: 2000,
    icon: god,
    title: "Бог кода",
    lvl: 10,
  },
  {
    countMess: 1500,
    icon: CTO,
    title: "Технический директор",
    lvl: 9,
  },
  {
    countMess: 1000,
    icon: archt,
    title: "Архитектор",
    lvl: 8,
  },
  {
    countMess: 800,
    icon: tl,
    title: "Тимлид",
    lvl: 7,
  },
  {
    countMess: 700,
    icon: senior,
    title: "Сеньор",
    lvl: 6,
  },
  {
    countMess: 600,
    icon: middle,
    title: "Мидл",
    lvl: 5,
  },
  {
    countMess: 500,
    icon: coder,
    title: "Кодер",
    lvl: 4,
  },
  {
    countMess: 200,
    icon: junior,
    title: "Джун",
    lvl: 3,
  },
  {
    countMess: 50,
    icon: trainee,
    title: "Стажер",
    lvl: 2,
  },
  {
    countMess: 0,
    icon: hw,
    title: "Hello World",
    lvl: 1,
  },
];
