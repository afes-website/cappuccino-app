import "workbox-precaching/createHandlerBoundToURL";
import { RouteHandlerCallback } from "workbox-core/types";

declare module "workbox-precaching/createHandlerBoundToURL" {
  export function createHandlerBoundToURL(url: string): RouteHandlerCallback;
}
