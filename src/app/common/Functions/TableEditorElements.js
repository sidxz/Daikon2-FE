import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { useContext } from "react";
import { RootStoreContext } from "../../stores/rootStore";
import FDate from "../FDate/FDate";

/**
 * Date Editor component that wraps the Calendar component
 * to provide date editing functionality.
 *
 * @param {object} options - Editor options.
 * @returns {JSX.Element} - DateEditor component JSX.Element.
 */
export const DateEditor = (options) => {
  return (
    <div className="p-float-label">
      <Calendar
        inputId="edit_date"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
      <label htmlFor="edit_date">
        <FDate timestamp={options.value} hideTime={true} />
      </label>
    </div>
  );
};

/**
 * Person Name Editor component that wraps the AutoComplete component
 * to provide person name editing functionality.
 *
 * @param {object} options - Editor options.
 * @param {Array} filteredNames - Filtered names for suggestions.
 * @param {function} setFilteredNames - Setter function for filtered names.
 * @returns {JSX.Element} - PersonNameEditor component JSX.Element.
 */
export const PersonNameEditor = (options, filteredNames, setFilteredNames) => {
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.generalStore;

  /**
   * Event handler for searching users.
   *
   * @param {object} event - AutoComplete event object.
   */
  const searchUser = (event) => {
    const query = event.query;
    const filteredResults = appVars.appUsersFlattened.filter((username) =>
      username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNames(filteredResults);
  };

  return (
    <AutoComplete
      value={options.value}
      delay={1500}
      suggestions={filteredNames}
      completeMethod={searchUser}
      onChange={(e) => options.editorCallback(e.target.value)}
      dropdown
    />
  );
};

/**
 * Text Editor component that wraps the InputText component
 * to provide text editing functionality.
 *
 * @param {object} options - Editor options.
 * @returns {JSX.Element} - TextEditor component JSX.Element.
 */
export const TextEditor = (options) => {
  return (
    <InputText
      type="text"
      value={options.value}
      onChange={(e) => options.editorCallback(e.target.value)}
    />
  );
};
