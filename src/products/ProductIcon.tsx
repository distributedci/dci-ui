import {
  BoxIcon,
  OpenshiftIcon,
  OpenstackIcon,
  RedhatIcon,
} from "@patternfly/react-icons";

interface ProductIconProps
  extends Omit<React.ComponentProps<typeof BoxIcon>, "name"> {
  name: string;
}

export default function ProductIcon({ name, ...props }: ProductIconProps) {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName === "openshift") return <OpenshiftIcon {...props} />;
  if (lowercaseName === "openstack") return <OpenstackIcon {...props} />;
  if (lowercaseName === "rhel") return <RedhatIcon {...props} />;
  return <BoxIcon {...props} />;
}
