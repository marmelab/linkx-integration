import { Resource } from "ra-core";

import { Admin } from "@/components/admin";

import { GameList } from "./components/resources/games/game-list";
import { GameShow } from "./components/resources/games/game-show";
import { UserEdit } from "./components/resources/users/user-edit";
import { UserList } from "./components/resources/users/user-list";
import { UserShow } from "./components/resources/users/user-show";
import { dataProvider } from "./data-provider";
import { authProvider } from "./token-auth-provider";

const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    <Resource
      name="users"
      recordRepresentation="displayName"
      list={UserList}
      edit={UserEdit}
      show={UserShow}
    />
    <Resource name="games" list={GameList} show={GameShow} />
  </Admin>
);

export default App;
