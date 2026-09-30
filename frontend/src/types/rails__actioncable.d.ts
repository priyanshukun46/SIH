declare module '@rails/actioncable' {
  export interface Consumer {
    subscriptions: Subscriptions;
    connect(): void;
    disconnect(): void;
    ensureActiveConnection(): void;
  }

  export interface ChannelMixin {
    connected?: () => void;
    disconnected?: () => void;
    received?: (data: any) => void;
    [key: string]: any;
  }

  export interface Subscriptions {
    create<T extends Subscription>(
      channel: string | Record<string, any>,
      mixin?: ChannelMixin
    ): T;
  }

  export interface Subscription {
    unsubscribe(): void;
    perform(action: string, data?: object): void;
    send(data: object): boolean;
  }

  export function createConsumer(url?: string): Consumer;
}
