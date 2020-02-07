import * as React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AppShell } from "../../app-common";

function loadMicrofrontends() {
  const defaultMicrofrontend = () => null;
  const microfrontends = Promise.resolve(
    window.microfrontends ||
      fetch("./microfrontends.json").then(res => res.json())
  );
  return microfrontends.then(urls =>
    Promise.all(
      urls.map(
        url =>
          new Promise(resolve => {
            const s = document.createElement("script");
            s.src = url;
            s.onerror = err => {
              console.error(err);
              resolve({
                url,
                Microfrontend: defaultMicrofrontend
              });
            };
            s.onload = () => {
              resolve({
                url,
                Microfrontend: s.App || defaultMicrofrontend
              });
            };
            document.body.appendChild(s);
          })
      )
    )
  );
}

loadMicrofrontends().then(microfrontends => {
  const app = document.querySelector("#app");
  hydrate(
    <BrowserRouter>
      <AppShell microfrontends={microfrontends} />
    </BrowserRouter>,
    app
  );
});

setTimeout(() => {
  window.parcelRequire = require;
}, 0);
