import * as React from "react";

export const AppShell = ({ microfrontends }) => (
  <>
    {microfrontends.map(({ url, Microfrontend }) => (
      <Microfrontend key={url} />
    ))}
  </>
);
