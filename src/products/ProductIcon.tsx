import {
  BoxIcon,
  OpenshiftIcon,
  OpenstackIcon,
  RedhatIcon,
} from "@patternfly/react-icons";

interface ProductIconProps
  extends Omit<React.ComponentProps<typeof BoxIcon>, "name"> {
  name: string | null;
}

export default function ProductIcon({ name, ...props }: ProductIconProps) {
  if (name === null) return <BoxIcon {...props} />;
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.startsWith("ocp") || lowercaseName.startsWith("openshift"))
    return <OpenshiftIcon {...props} />;
  if (lowercaseName.startsWith("rhel")) return <RedhatIcon {...props} />;
  if (lowercaseName.startsWith("osp")) return <OpenstackIcon {...props} />;
  return <BoxIcon {...props} />;
}
