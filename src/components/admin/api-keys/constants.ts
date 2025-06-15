
import { ServiceConfig } from "./types";

export const API_SERVICES: ServiceConfig[] = [
  { id: 'youtube', name: 'YouTube', fields: ['client_id', 'client_secret'] },
  { id: 'twitch', name: 'Twitch', fields: ['client_id', 'client_secret'] }
];
