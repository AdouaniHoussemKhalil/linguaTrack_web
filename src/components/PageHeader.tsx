import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string | undefined;
  actions?: ReactNode | undefined;
}

export const PageHeader = ({ title, description, actions }: PageHeaderProps) => (
  <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold text-neutral-12 sm:text-3xl">{title}</h1>
      {description && <p className="text-sm text-neutral-11">{description}</p>}
    </div>
    {actions && <div className="flex min-w-0 flex-wrap items-center gap-2">{actions}</div>}
  </header>
);
