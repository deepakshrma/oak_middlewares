import { Application, Middleware } from "https://deno.land/x/oak/mod.ts";
import { requestTraceMiddleware } from "../request_trace.ts";

const app = new Application();

app.use(requestTraceMiddleware<Middleware>());
app.use(
  requestTraceMiddleware<Middleware>({ type: "combined" }),
);
app.use(
  requestTraceMiddleware<Middleware>({ type: "common" }),
);
app.use(
  requestTraceMiddleware<Middleware>({ type: "dev" }),
);
app.use(
  requestTraceMiddleware<Middleware>({ type: "short" }),
);

// This will not print since log level is higher
// More options: import { Logger, LoggerOptions } from "https://deno.land/x/deno_util/logger.ts";
app.use(
  requestTraceMiddleware<Middleware>({
    type: "tiny",
    loggerOptions: { level: 1 },
  }),
);

// Disable logger, use raw console.log
app.use(
  requestTraceMiddleware<Middleware>({
    type: "tiny",
    raw: true,
  }),
);

app.use((ctx) => {
  ctx.response.body = "Hello world!";
});
console.log("server is running on: http://localhost:8080");
await app.listen(":8080");
