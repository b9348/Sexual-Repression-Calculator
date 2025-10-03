import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { resolve } from "path";
import { app } from "./src/server/app.dev";
import { getRequestListener } from "@hono/node-server";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: "./index.html",
    tags: [
      {
        tag: "script",
        children: `
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?ff8ab2328f392852f04a3697ca691449";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();`,
        append: false,
      },
    ],
  },
  source: {
    entry: {
      index: "./src/main.tsx",
    },
  },
  output: {
    distPath: {
      root: "dist/web",
    },
    legalComments: "none",
  },
  dev: {
    watchFiles: {
      paths: ["./src/server"],
      type: "reload-server",
    },
    setupMiddlewares: [
      (middlewares) => {
        middlewares.unshift((req, res, next) => {
          if (req.url?.startsWith("/api")) {
            const listener = getRequestListener(app.fetch);
            listener(req, res);
          } else {
            next();
          }
        });
      },
    ],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
