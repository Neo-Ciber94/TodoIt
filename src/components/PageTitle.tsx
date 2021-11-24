export interface PageTitleProps{
  title: string;
  center?: boolean;
  className?: string;
}

export function PageTitle(props: PageTitleProps) {
  const TitleText = <h1 className={`font-mono text-5xl my-4 ${props.className || ""}`}>{props.title}</h1>;

  if (props.center === true) {
    return <div className="flex flex-row justify-center">{TitleText}</div>;
  }

  return TitleText;
}
