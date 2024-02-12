import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import React, { useEffect, useState } from "react";
import tbdaLogo from "../../assets/TBDA.svg";
import { appVersion } from "../../constants/appVersion";
import "./CustomLoginLanding.css";

/* Custom Login Landing Page for Daikon Enterprise TBDA */

const CustomLoginLanding = ({ loginButtonClicked }) => {
  // Get values from local storage
  const storedRememberChoice = JSON.parse(
    localStorage.getItem("Login_RememberChoice")
  );
  const storedTermsAgreed = JSON.parse(
    localStorage.getItem("Login_TermsAgreed")
  );

  // set states from local storage values, so that the checkbox is checked if the user has previously
  // agreed to the terms. or false if local storage is empty
  const [termsAgreed, setTermsAgreed] = useState(storedTermsAgreed || false);
  const [rememberChoice, setRememberChoice] = useState(
    storedRememberChoice || false
  );

  useEffect(() => {
    // only remember Login_TermsAgreed if the user has checked the remember choice checkbox
    if (rememberChoice) {
      localStorage.setItem("Login_TermsAgreed", JSON.stringify(termsAgreed));
    }
    localStorage.setItem(
      "Login_RememberChoice",
      JSON.stringify(rememberChoice)
    );
  }, [rememberChoice, termsAgreed]);

  return (
    <div className="BackgroundLogin">
      <div className="flex flex-column align-items-center justify-content-center">
        <div className="heading flex flex-column w-full pl-4 mt-2">
          <div className="flex">
            <h1 style={{ margin: "0" }}> D A I K O N </h1>
          </div>
          <div className="flex gap-2">
            <h5 style={{ margin: "0" }}>{appVersion.release}</h5>
            <h5 style={{ margin: "0" }}>{appVersion.stream}</h5>
          </div>
        </div>
        <div className="flex align-content-center flex-wrap card-container yellow-container min-h-content w-full pl-8 pr-8 ">
          <div className="flex justify-content-center flex-wrap card-container yellow-container w-full ">
            <div className="flex align-items-center justify-content-center  border-round m-2">
              <img src={tbdaLogo} width="220" />
            </div>
          </div>
          <div className="flex justify-content-center w-full">
            <div className="disclaimer flex flex-column align-items-center justify-content-center ml-8 mr-8 pl-8 pr-8 bg-white ">
              <p>
                To access TBDA information in any TBDA supported information
                repositories or data systems, all users must acknowledge
                compliance with the following statements as specified in the
                Cooperation and Sharing Agreement (TBDA C&S) agreed to by your
                organization:{" "}
              </p>
              <ol>
                <li>
                  Information contained in any TBDA supported data repository
                  including but not limited to TBDA SharePoint site, CDD TBDA
                  disclosure vaults (for example the “TBDA Disclosed Compounds”
                  vault), TBDA Teams Sites, DAIKON, and any other TBDA related
                  repositories, should be treated as TBDA Confidential unless
                  the content has been disclosed publicly or unless the content
                  originator has agreed that the information can be more widely
                  shared or used.
                </li>
                <li>
                  Content deposited by another party (including presentations,
                  spreadsheets, compound structures, data, etc.) should not be
                  distributed or presented to others unless this information is
                  necessary to perform work related to the TBDA and agreed upon
                  with the data owner. Documents which are marked as TBDA
                  Confidential (or Confidential for the TBDA, etc.) should
                  retain this designation and any representations of any
                  enclosed data should also include this designation.
                </li>
                <li>
                  Files (including exports of data from CDD vaults) should be
                  stored in secure areas which are only accessible to those
                  authorized to access the information.
                </li>
                <li>
                  In all cases, consent should be obtained from data/compound
                  owners before any further experiments, analyses, or extensions
                  of their work are performed.
                </li>
                <li>
                  Failure to comply with the terms of the Sharing and
                  Cooperation Agreement, including the above statements, may
                  result in an individual’s access to any TBDA repository to be
                  revoked.
                </li>
              </ol>
            </div>
          </div>
          <div className="disclaimer flex align-items-center justify-content-center ml-8 mr-8 pl-8 pr-8 bg-white">
            <div className="flex gap-5 m-2 align-items-center justify-content-center">
              <Checkbox
                onChange={(e) => setTermsAgreed(e.checked)}
                checked={termsAgreed}
              />
              I acknowledge that I have reviewed the above statements and will
              comply with these expectations. If I have any questions regarding
              the Sharing and Cooperation Agreement or the above statements, I
              will seek clarification from my TBDA Member representative.
            </div>
          </div>
          <div className="disclaimer flex align-items-center ml-8 mr-8 pl-8 pr-8 bg-white w-full">
            <div className="flex gap-5 m-2 align-items-center">
              <Checkbox
                onChange={(e) => setRememberChoice(e.checked)}
                checked={rememberChoice}
              />
              Remember my choice.
            </div>
          </div>
          <div className="flex justify-content-center flex-wrap card-container w-full ml-8 mr-8 pl-8 pr-8 bg-white">
            <div className="loginButton flex align-items-center justify-content-center m-4">
              <Button
                label="Login with SSO"
                onClick={() => loginButtonClicked()}
                disabled={!termsAgreed}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomLoginLanding;
