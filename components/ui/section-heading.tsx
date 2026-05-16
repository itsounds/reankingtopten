import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow ? (
        <span className="inline-flex rounded-full bg-[#E8F0FE] px-3 py-1 text-xs font-medium tracking-[0.14em] text-[#1A73E8] uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.03em] text-[#202124] md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-[#5F6368] md:text-lg">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
