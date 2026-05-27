import { createServer } from "node:http";
import { env } from "./lib/env.js";
import { app } from "./app.js";

const server = createServer(app);

server.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on http://localhost:${env.PORT}`);
});

