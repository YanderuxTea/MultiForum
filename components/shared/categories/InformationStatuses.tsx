import { ILastStatuses } from "./BlockAdditionalInformation";
import StatusCard from "./StatusCard";

export default function InformationStatuses({
  props,
}: {
  props: ILastStatuses[];
}) {
  return (
    <div className="divide-y divide-neutral-300 dark:divide-neutral-700">
      {props.length > 0 ? (
        props.map((status) => {
          return <StatusCard key={status.id} props={status} />;
        })
      ) : (
        <p>Пока что статусов нет</p>
      )}
    </div>
  );
}
