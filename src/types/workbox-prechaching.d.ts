import { RouteHandlerCallback } from "workbox-core/types";
import "workbox-precaching/createHandlerBoundToURL";

declare module "workbox-precaching/createHandlerBoundToURL" {
  export function createHandlerBoundToURL(url: string): RouteHandlerCallback;
}
