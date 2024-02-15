import * as xmljs from "xml-js";
import AxiosGeneric from "../../../../Shared/Axios/AxiosGeneric";

const UniprotBaseURL = "https://rest.uniprot.org/uniprotkb/";

const XMLresponseFormatter = (response) =>
  xmljs.xml2js(response.data, { compact: true, spaces: 4 });

const axiosGeneric = new AxiosGeneric(
  null,
  UniprotBaseURL,
  XMLresponseFormatter
);

const UniprotAPI = {
  getCrossReference: (uniprotId) => axiosGeneric.get(`${uniprotId}.xml`),
};

export default UniprotAPI;
