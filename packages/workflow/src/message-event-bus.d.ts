import type { DateTime } from 'luxon';
import { z } from 'zod';
import type { INodeCredentials } from './interfaces';
export declare const enum EventMessageTypeNames {
    generic = "$$EventMessage",
    audit = "$$EventMessageAudit",
    confirm = "$$EventMessageConfirm",
    workflow = "$$EventMessageWorkflow",
    node = "$$EventMessageNode",
    execution = "$$EventMessageExecution",
    aiNode = "$$EventMessageAiNode",
    runner = "$$EventMessageRunner",
    queue = "$$EventMessageQueue"
}
export declare const enum MessageEventBusDestinationTypeNames {
    abstract = "$$AbstractMessageEventBusDestination",
    webhook = "$$MessageEventBusDestinationWebhook",
    sentry = "$$MessageEventBusDestinationSentry",
    syslog = "$$MessageEventBusDestinationSyslog"
}
export declare const messageEventBusDestinationTypeNames: MessageEventBusDestinationTypeNames[];
export interface IAbstractEventMessage {
    __type: EventMessageTypeNames;
    id: string;
    ts: DateTime;
    eventName: string;
    message: string;
    payload: any;
}
declare const webhookParameterItemSchema: any;
declare const webhookParameterOptionsSchema: any;
export declare const MessageEventBusDestinationOptionsSchema: any;
export declare const MessageEventBusDestinationWebhookOptionsSchema: any;
export declare const MessageEventBusDestinationSentryOptionsSchema: any;
export declare const MessageEventBusDestinationSyslogOptionsSchema: any;
export type MessageEventBusDestinationOptions = Omit<z.infer<typeof MessageEventBusDestinationOptionsSchema>, '__type' | 'credentials'> & {
    __type?: MessageEventBusDestinationTypeNames;
    credentials?: INodeCredentials;
};
export type MessageEventBusDestinationWebhookParameterItem = z.infer<typeof webhookParameterItemSchema>;
export type MessageEventBusDestinationWebhookParameterOptions = z.infer<typeof webhookParameterOptionsSchema>;
export type MessageEventBusDestinationWebhookOptions = Omit<z.infer<typeof MessageEventBusDestinationWebhookOptionsSchema>, '__type' | 'credentials'> & {
    __type?: MessageEventBusDestinationTypeNames;
    credentials?: INodeCredentials;
};
export type MessageEventBusDestinationSyslogOptions = Omit<z.infer<typeof MessageEventBusDestinationSyslogOptionsSchema>, '__type' | 'credentials'> & {
    __type?: MessageEventBusDestinationTypeNames;
    credentials?: INodeCredentials;
};
export type MessageEventBusDestinationSentryOptions = Omit<z.infer<typeof MessageEventBusDestinationSentryOptionsSchema>, '__type' | 'credentials'> & {
    __type?: MessageEventBusDestinationTypeNames;
    credentials?: INodeCredentials;
};
export declare const defaultMessageEventBusDestinationOptions: MessageEventBusDestinationOptions;
export declare const defaultMessageEventBusDestinationSyslogOptions: MessageEventBusDestinationSyslogOptions;
export declare const defaultMessageEventBusDestinationWebhookOptions: MessageEventBusDestinationWebhookOptions;
export declare const defaultMessageEventBusDestinationSentryOptions: MessageEventBusDestinationSentryOptions;
export {};
//# sourceMappingURL=message-event-bus.d.ts.map