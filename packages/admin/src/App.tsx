import { Resource } from "ra-core";
import jsonServerProvider from "ra-data-json-server";

import { Admin } from "@/components/admin";

import { UserList } from "./components/resources/user-list";

const App = () => (
  <Admin
    dataProvider={jsonServerProvider(
      import.meta.env.VITE_API_URL ?? "http://localhost/api/admin",
    )}
  >
    <Resource name="users" list={UserList} />
  </Admin>
);

export default App;
