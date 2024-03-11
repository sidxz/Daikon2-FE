import { AutoComplete } from "primereact/autocomplete";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../RootStore";

const InputScientist = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.authStore;

  const users = appVars.userNames;
  const search = (event) => {
    const query = event.query.toLowerCase();

    // Filter through the users object, looking for names that include the query string
    const filteredUsers = Object.entries(users).reduce((acc, [key, name]) => {
      if (name.toLowerCase().includes(query)) {
        acc.push(name);
      }
      return acc;
    }, []);

    setItems(filteredUsers);
  };

  const [items, setItems] = useState([]);

  return (
    <AutoComplete suggestions={items} completeMethod={search} {...props} />
  );
};

export default InputScientist;
