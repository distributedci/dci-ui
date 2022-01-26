import {
  Bullseye,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
} from "@patternfly/react-core";

export default function Page404() {
  return (
    <Bullseye>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">404</Text>
          <Text component="p">
            we are looking for your page...but we can't find it
          </Text>
        </TextContent>
      </PageSection>
    </Bullseye>
  );
}
