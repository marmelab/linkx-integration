import { fetchUtils, type Options } from "ra-core";
import jsonServerProvider from "ra-data-json-server";

const httpClient = (url: string, options: Options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  options.credentials = "include";

  return fetchUtils.fetchJson(url, options);
};

export const dataProvider = jsonServerProvider(
  (import.meta.env.VITE_API_URL ?? "http://localhost/api") + "/admin",
  httpClient,
);
