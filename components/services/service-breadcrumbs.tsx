import Link from "next/link";

type ServiceBreadcrumbsProps = {
  serviceName: string;
};

export function ServiceBreadcrumbs({
  serviceName,
}: ServiceBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="type-caption text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link
            href="/"
            className="underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:text-foreground hover:decoration-border focus-visible:outline-2 focus-visible:outline-offset-3"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            href="/services"
            className="underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:text-foreground hover:decoration-border focus-visible:outline-2 focus-visible:outline-offset-3"
          >
            Services
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-foreground">
          {serviceName}
        </li>
      </ol>
    </nav>
  );
}
