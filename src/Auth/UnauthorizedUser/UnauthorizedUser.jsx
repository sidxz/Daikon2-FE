import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import "./UnauthorizedUser.css";

const UnauthorizedUser = ({ onSignOut, ssoUser, serverError }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  let waitingRender = (
    <div className="flex flex-column align-items-center justify-content-center gap-5">
      <div className="flex w-full">
        <ProgressSpinner />
      </div>
      <div className="flex">Authenticating, please wait...</div>
    </div>
  );
  let unauthorizedRender = (
    <>
      <h5>[ACCOUNT INACTIVE]</h5>
      <p>
        Hello {ssoUser?.profile?.email}, <br />
        <br />
        We successfully authenticated you using your SSO credentials, but it
        appears your account is currently inactive for Daikon. To gain access,
        please reach out to a Daikon administrator to have your account
        activated. Thank you for your understanding.
      </p>
      <br />
      <Button label="Logout" onClick={() => onSignOut()}></Button>
    </>
  );
  // The user check failed because of the server (no response or 5xx), not the account
  let serverUnavailableRender = (
    <>
      <h5>[SERVER UNAVAILABLE]</h5>
      <p>
        Hello {ssoUser?.profile?.email}, <br />
        <br />
        You are signed in, but the Daikon server is unavailable right now (
        {serverError}). This is usually temporary, so please try again in a few
        minutes. If it keeps happening, contact a Daikon administrator.
      </p>
      <br />
      <div className="flex gap-3 justify-content-center">
        <Button label="Try again" onClick={() => window.location.reload()} />
        <Button label="Logout" onClick={() => onSignOut()} />
      </div>
    </>
  );

  return (
    <div className="UserUnauthorized">
      <div className="BackgroundLogin">
        <div className="LoginRight">
          <div className="LoginCentered">
            <div className="LoginLanding">
              <div>
                <div className="LoginLoginBox" id="logoutButton">
                  <h1>D A I K O N</h1>
                  {serverError
                    ? serverUnavailableRender
                    : loading
                      ? waitingRender
                      : unauthorizedRender}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedUser;
