import {
  assertEquals,
  assertNotEquals,
  assert,
} from "https://deno.land/std@0.51.0/testing/asserts.ts";
import { requestTraceMiddleware } from "./mod.ts";
import { Middleware, Context, Status } from "https://deno.land/x/oak/mod.ts";
import { readLines } from "https://deno.land/std/io/mod.ts";

Deno.test("requestTraceMiddleware: should return valid function", () => {
  assertNotEquals(requestTraceMiddleware<Middleware>(), null);
  assertEquals(typeof requestTraceMiddleware<Middleware>(), "function");
});

// TODO: Add test case for logger. :(

// Deno.test("requestTraceMiddleware: should print valid log", async () => {
//   type a = ReturnType<console.log>
//   const mockContext = {
//     response: {
//       headers: new Headers(),
//     },
//     request: {
//       method:"GET",
//       url: {
//         pathname: "/home",
//       },
//       headers: new Headers(),
//     }
//   } as a;
//   // console.log = (...mes: string[]): void => {

//   // }
//   const mockNext = () => {
//     return new Promise<void>((resolve) => {
//       setTimeout(() => {
//         resolve();
//       }, 50);
//     });
//   };
//   const std = await readLines(Deno.stdin)
//   const middleware = requestTraceMiddleware<Middleware>();
//   await middleware(mockContext, mockNext);
//   // assertEquals(mockContext.response.headers.has("x-response-time"), false);
//   const { value: line } = await std.next()
//   console.log("line", line)
//   const value = parseInt(
//     mockContext.response.headers.get("x-response-time")!,
//     10,
//   );
//   // assert(value >= 50);
// });
