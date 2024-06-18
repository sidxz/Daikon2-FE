import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import "./UnauthorizedUser.css";

const UnauthorizedUser = ({ onSignOut, ssoUser }) => {
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

  return (
    <div className="UserUnauthorized">
      <div className="BackgroundLogin">
        <div className="LoginRight">
          <div className="LoginCentered">
            <div className="LoginLanding">
              <div>
                <div className="LoginLoginBox" id="logoutButton">
                  <h1>D A I K O N</h1>
                  {loading ? waitingRender : unauthorizedRender}
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
