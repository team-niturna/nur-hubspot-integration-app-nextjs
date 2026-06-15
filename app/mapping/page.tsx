import { getHubspotPropertyOptions } from "@/lib/hubspotProperties.server";
import { MappingScreen } from "@/components/mapping/mapping-screen";

const propertyOptions = getHubspotPropertyOptions();

export default function MappingPage() {
  return <MappingScreen propertyOptions={propertyOptions} />;
}
