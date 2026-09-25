import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode | undefined;
  title: string;
  description?: string | undefined;
  action?: ReactNode | undefined;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-7 px-6 py-12 text-center">
    {icon && <div className="text-neutral-9 [&>svg]:size-10">{icon}</div>}
    <p className="text-base font-semibold text-neutral-12">{title}</p>
    {description && <p className="max-w-md text-sm text-neutral-11">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);
