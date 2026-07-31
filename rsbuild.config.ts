import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginPrerenderPlaywright } from "rsbuild-plugin-prerender-playwright";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginPrerenderPlaywright({
      routes: ["/", "/guide", "/science"],
      skipThirdPartyRequests: true,
      playwright: {
        waitUntil: "networkidle",
        timeout: 30000,
      },
    }),
  ],
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
      root: "dist",
    },
    legalComments: "none",
  },
  server: {
    publicDir: {
      name: "public",
      copyOnBuild: true,
    },
  },
  dev: {},
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
