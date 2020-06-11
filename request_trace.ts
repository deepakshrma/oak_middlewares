import { Middleware } from "https://deno.land/x/oak/mod.ts";
import { Logger, LoggerOptions } from "https://deno.land/x/deno_util/logger.ts";

/**
 * Extract token value from request, response
 *
 * @param request
 * @param response
 * @param tokenString {""}
 */
const parseToken = (request: any, response: any, tokenString = "") => {
  const tokens = tokenString.split(" ").reduce((tokens: any, token: string) => {
    switch (token) {
      case ":method":
        tokens[token] = String(request.method);
        break;
      case ":remote-addr":
        tokens[token] = request.headers.get("host");
        break;
      case ":referrer":
      case ":referer":
        tokens[token] = request.headers.get("referer");
        break;
      case ":user-agent":
        tokens[token] = request.headers.get("user-agent");
        break;
      case ":url":
        tokens[token] = request.url.pathname;
        break;
      case ":status":
        tokens[token] = String(response.status);
        break;
      case ":content-length":
        tokens[token] = response.body?.toString().length.toString() || "0";
        break;
    }
    return tokens;
  }, {});
  return tokens;
};
export interface Options {
  /**
   * type:  type of the trace log
   *
   * @default "tiny"
   */
  type?: "combined" | "common" | "dev" | "short" | "tiny";
  /**
   * loggerOptions: customized logger
   *
   * @default {}
   */
  loggerOptions?: LoggerOptions;
  /**
   * raw: use raw console.log
   *
   * @default false
   */
  raw?: boolean;
}

/**
 * Options
 *
 * @param param Options
 */
export const requestTraceMiddleware = <T = Middleware>({
  type = "tiny",
  loggerOptions = {},
  raw: disableLogger = false,
}: Options = {}): T | Middleware => {
  const logger = new Logger(loggerOptions);
  return async function (ctx, next) {
    let formatString;
    switch (type) {
      case "combined":
        formatString =
          ":remote-addr - :method :url :status :content-length :referrer :user-agent";
        break;
      case "common":
        formatString = ":remote-addr - :method :url :status :content-length";
        break;
      case "dev":
        formatString = ":method :url :status :response-time - :content-length";
        break;
      case "short":
        formatString =
          ":remote-addr :method :url :status :content-length :response-time";
        break;
      default:
        formatString = ":method :url :status :content-length :response-time";
        break;
    }
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    const { request, response } = ctx;
    let tokens = parseToken(request, response, formatString);
    tokens[":response-time"] = "- " + ms.toString() + "ms";
    const message = formatString.replace(
      /(:[\w-]+)/g,
      (_: any, matched: any) => {
        return tokens[matched] + " ";
      },
    );
    if (disableLogger) {
      console.info(message);
    } else {
      logger.info(message);
    }
  };
};
