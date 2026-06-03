import { TabItem, Tabs } from "flowbite-react";
import { SmsCompose } from "@/features/sms/SmsCompose";
import { SmsGateways } from "@/features/sms/SmsGateways";
import { SmsHistory } from "@/features/sms/SmsHistory";
import { SmsTemplates } from "@/features/sms/SmsTemplates";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function SmsPage() {
  return (
    <>
      <PageHeader title="SMS" description="Send notifications to customers and manage your Bangladeshi SMS gateways." />
      <Tabs variant="underline" aria-label="SMS">
        <TabItem active title="Compose">
          <SmsCompose />
        </TabItem>
        <TabItem title="History">
          <SmsHistory />
        </TabItem>
        <TabItem title="Templates">
          <SmsTemplates />
        </TabItem>
        <TabItem title="Gateways">
          <SmsGateways />
        </TabItem>
      </Tabs>
    </>
  );
}
