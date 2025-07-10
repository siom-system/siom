import * as admin from "firebase-admin";

admin.initializeApp();

export { getSionCacheData } from "./api"; // Presumindo que api.ts existe
export { webhookReceiver } from "./webhook";
export { buildBuffersFromCache } from "./utility"; // Linha mais importante aqui