import React from "react";

const CustomFooterConfidentialTag = () => {
  return (
    <div className="flex justify-content-center">
      <div className="disclaimer flex flex-column align-items-center justify-content-center ml-8 mr-8 pl-8 pr-8 bg-white ">
        <p>
          To access TBDA information in any TBDA supported information
          repositories or data systems, all users must acknowledge compliance
          with the following statements as specified in the Cooperation and
          Sharing Agreement (TBDA C&S) agreed to by your organization:{" "}
        </p>
        <ol>
          <li>
            Information contained in any TBDA supported data repository including but not limited to TBDA SharePoint site, CDD TBDA disclosure vaults (for example the “TBDA Disclosed Compounds” vault), TBDA Teams Sites, DAIKON, and any other TBDA related repositories, should be treated as TBDA Confidential  unless the content has been disclosed publicly or unless the content originator has agreed that the information can be more widely shared or used.
          </li>
          <li>
            Content deposited by another party (including presentations,
            spreadsheets, compound structures, data, etc.) should not be
            distributed or presented to others unless this information is
            necessary to perform work related to the TBDA and agreed upon with
            the data owner. Documents which are marked as TBDA Confidential (or
            Confidential for the TBDA, etc.) should retain this designation and
            any representations of any enclosed data should also include this
            designation.
          </li>
          <li>
            Files (including exports of data from CDD vaults) should be stored
            in secure areas which are only accessible to those authorized to
            access the information.
          </li>
          <li>
            In all cases, consent should be obtained from data/compound owners
            before any further experiments, analyses, or extensions of their
            work are performed.
          </li>
          <li>
            Failure to comply with the terms of the Sharing and Cooperation
            Agreement, including the above statements, may result in an
            individual’s access to any TBDA repository to be revoked.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default CustomFooterConfidentialTag;
