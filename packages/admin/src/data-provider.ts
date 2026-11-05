import { addRealTimeMethodsBasedOnMercure } from "@react-admin/ra-core-ee";
import queryString from "query-string";
import { fetchUtils, type GetManyParams, type Options } from "ra-core";
import jsonServerProvider from "ra-data-json-server";

const httpClient = (url: string, options: Options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  options.credentials = "include";

  return fetchUtils.fetchJson(url, options);
};

export const apiUrl =
  (import.meta.env.VITE_API_URL ?? "http://localhost/api") + "/admin";

const baseDataProvider = {
  ...jsonServerProvider(apiUrl, httpClient),
  getMany: async (resource: string, params: GetManyParams) => {
    const query = {
      id: params.ids,
      _embed: params?.meta?.embed,
    };
    const url = `${apiUrl}/${resource}?${queryString.stringify(query, { arrayFormat: "bracket" })}`;
    const { json } = await httpClient(url, { signal: params?.signal });
    return { data: json };
  },
};

export const dataProvider = addRealTimeMethodsBasedOnMercure(
  baseDataProvider,
  import.meta.env.VITE_MERCURE_PUBLIC_URL ??
    "http://localhost/.well-known/mercure",
);
