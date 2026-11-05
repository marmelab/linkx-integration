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

const mercureUrl =
  import.meta.env.VITE_MERCURE_PUBLIC_URL ??
  "http://localhost/.well-known/mercure";
export const dataProvider = addRealTimeMethodsBasedOnMercure(
  baseDataProvider,
  mercureUrl,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0Ly53ZWxsLWtub3duL21lcmN1cmUiLCJhdXRob3JpemF0aW9uX2RldGFpbHMiOlt7InR5cGUiOiJodHRwczovL21lcmN1cmUucm9ja3MvYXV0aG9yaXphdGlvbi1kZXRhaWwiLCJhY3Rpb25zIjpbInN1YnNjcmliZSJdLCJ0b3BpY3MiOlt7Im1hdGNoIjoiaHR0cDovL2xvY2FsaG9zdC9nYW1lcyJ9LHsibWF0Y2giOiJodHRwOi8vbG9jYWxob3N0L2dhbWVzLzppZCIsIm1hdGNoX3R5cGUiOiJ1cmxwYXR0ZXJuIn1dfV0sImNsaWVudF9pZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJleHAiOjE3OTM4Nzg3NzEsImlhdCI6MTc5Mzg3NTE3MSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImp0aSI6InVybjp1dWlkOmE4ZDdkZWQ2LTlhOTEtNDhmMi05OGM4LTJkZDc3MDIyOThjYyIsInN1YiI6InVybjp1dWlkOjJiYTJlNDcyLWI2ZjYtNGYzNS1iNzRhLWNiN2RhZWE0ZmYzMyJ9.clLunZsRszmsNtfDfpqkX15IZIv0UZOoBfXpY1VD4_w",
  mercureUrl + "/admin",
); // FIXME remove hardcoded token
