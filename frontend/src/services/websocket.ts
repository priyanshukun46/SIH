import { createConsumer, Consumer, Subscription } from '@rails/actioncable';

class CableService {
  private consumer: Consumer | null = null;
  private currentSubscription: Subscription | null = null;

  private getConsumer(): Consumer {
    if (!this.consumer) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/cable`;
      this.consumer = createConsumer(wsUrl);
    }
    return this.consumer;
  }

  public subscribeToSimulation(
    simulationRunId: number,
    onReceived: (data: any) => void
  ): Subscription {
    // Unsubscribe from previous if active
    this.unsubscribe();

    const consumer = this.getConsumer();
    this.currentSubscription = consumer.subscriptions.create(
      { channel: 'SimulationChannel', simulation_run_id: simulationRunId },
      {
        connected: () => {
          console.log(`[Cable] Connected to Simulation #${simulationRunId}`);
        },
        disconnected: () => {
          console.log(`[Cable] Disconnected from Simulation #${simulationRunId}`);
        },
        received: (data: any) => {
          onReceived(data);
        }
      }
    );

    return this.currentSubscription;
  }

  public unsubscribe() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
  }
}

export const cableService = new CableService();
