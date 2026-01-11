import { ILastThemes } from "./BlockAdditionalInformation";
import ThemeCard from "./ThemeCard";

export default function InformationThemes({ props }: { props: ILastThemes[] }) {
  return (
    <div>
      {props.length > 0 ? (
        props.map((theme) => {
          return <ThemeCard key={theme.id} props={theme} />;
        })
      ) : (
        <p>Пока что тем нет</p>
      )}
    </div>
  );
}
