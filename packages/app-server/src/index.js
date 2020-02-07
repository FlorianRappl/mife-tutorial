const express = require("express");
const Module = require("module");
const { readFileSync } = require("fs");
const { resolve } = require("path");
const { createElement } = require("react");
const { renderToString } = require("react-dom/server");
const { StaticRouter } = require("react-router-dom");
const { AppShell } = require("../../app-common");

const nodeRequire = Module.prototype.require;
const port = process.env.PORT || 1234;
const www = resolve(__dirname, "static");
const app = express();
const indexHtml = readFileSync(resolve(www, "index.html"), "utf8");
const microfrontendUrls = JSON.parse(
  readFileSync(resolve(www, "microfrontends.json"), "utf8")
);

global.parcelRequire = require;

const microfrontends = microfrontendUrls.map(url => ({
  url,
  Microfrontend: nodeRequire(resolve(www, url)).default
}));

async function sendIndex(req, res) {
  const shell = createElement(AppShell, {
    microfrontends
  });
  const app = createElement(
    StaticRouter,
    {
      location: req.path
    },
    shell
  );
  const body = renderToString(app);
  const script = `<script>window.microfrontends = ${JSON.stringify(
    microfrontendUrls
  )};</script>`;
  const content = indexHtml
    .replace('<div id="app"></div>', `<div id="app">${body}</div>`)
    .replace('<noscript id="data"></noscript>', script);
  res.send(content);
}

app.get("/", sendIndex);

// resolve any static content, such as /dynamic.js
app.get(
  "*",
  express.static(www, {
    fallthrough: true
  })
);

// fall back to the index (SPA mode) in any other case
app.get("*", sendIndex);

app.listen(port, () => {
  console.log(`Server running at port ${port}.`);
});
