import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

console.log("Route handler initialized");

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})