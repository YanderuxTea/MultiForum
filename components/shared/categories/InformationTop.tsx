import TopCard from "./TopCard";

export interface ITopUsers {
  id: string;
  login: string;
  avatar: string | null;
  reputation: number;
  role: string;
}
export default function InformationTop({ props }: { props: ITopUsers[] }) {
  return (
    <div className="flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700">
      {props.map((user, index) => {
        return <TopCard key={user.id} props={user} position={index + 1} />;
      })}
    </div>
  );
}
