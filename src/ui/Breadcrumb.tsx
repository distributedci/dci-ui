import { Breadcrumb, BreadcrumbItem } from "@patternfly/react-core";
import { Link } from "react-router";

interface ILink {
  to?: string;
  title: React.ReactNode;
}

interface DCIBreadcrumbProps {
  links: ILink[];
  [key: string]: any;
}

export default function DCIBreadcrumb({ links, ...props }: DCIBreadcrumbProps) {
  return (
    <Breadcrumb {...props}>
      {links.map((link, i) => {
        if (link.to) {
          return (
            <BreadcrumbItem key={i}>
              <Link to={link.to}>{link.title}</Link>
            </BreadcrumbItem>
          );
        }
        return <BreadcrumbItem key={i}>{link.title}</BreadcrumbItem>;
      })}
    </Breadcrumb>
  );
}
