import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let connection: any = null;

export function createNotificationsConnection(onMessage: (payload: any) => void) {
  connection = new HubConnectionBuilder()
    .withUrl("/hubs/notifications")
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  connection.on("EntityChanged", (payload: any) => {
    // payload: { entity: "education", action: "create|update|delete", item|id }
    onMessage(payload);
  });

  connection.start().catch((err: any) => {
    console.error("SignalR connection error:", err);
  });

  return connection;
}

export function stopNotificationsConnection() {
  if (connection) {
    connection.stop();
    connection = null;
  }
}