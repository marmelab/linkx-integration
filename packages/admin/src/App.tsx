import { Resource } from "ra-core";
import jsonServerProvider from "ra-data-json-server";

import { Admin } from "@/components/admin";

import { UserEdit } from "./components/resources/users/user-edit";
import { UserList } from "./components/resources/users/user-list";
import { UserShow } from "./components/resources/users/user-show";

const App = () => (
  <Admin
    dataProvider={jsonServerProvider(
      import.meta.env.VITE_API_URL ?? "http://localhost/api/admin",
    )}
  >
    <Resource name="users" list={UserList} edit={UserEdit} show={UserShow} />
  </Admin>
);

export default App;
