import { AIDocumentIcon } from "../../icons/AIDocumentIcon";
export const sidePanelItems = (navigate) => {
  return [
    {
      label: "Sections",
      items: [
        {
          label: "Public Data",
          icon: "ri-book-open-line",
          command: () => {
            navigate(`public/`);
          },
        },

        {
          label: "Private Data",
          icon: "ri-git-repository-private-fill",
          command: () => {
            navigate(`private/`);
          },
        },
        {
          label: "Documents",
          icon: <AIDocumentIcon className="mr-2" />,
          command: () => {
            navigate("docs/");
          },
        },
        {
          label: "Discussion",
          icon: "ri-discuss-line",
          command: () => {
            navigate(`discussion/`);
          },
        },
      ],
    },
    {
      label: "Actions",
      items: [
        {
          label: "Promote to Target",
          icon: "pi pi-external-link",
          command: () => {
            navigate(`/wf/target/sourcing/tpq/`);
          },
        },
      ],
    },
  ];
};
