import { Button } from "primereact/button";
import "./UnauthorizedUser.css";

const UnauthorizedUser = ({ onSignOut, ssoUser }) => {
  console.log("ssoUser", ssoUser);
  return (
    <div className="UserUnauthorized">
      <div className="BackgroundLogin">
        {/* <div className="LoginLeft">
        <div className="centered"></div>
      </div> */}

        <div className="LoginRight">
          <div className="LoginCentered">
            <div className="LoginLanding">
              <div>
                <div className="LoginLoginBox" id="logoutButton">
                  <h1>D A I K O N</h1>

                  <h5>[ACCOUNT INACTIVE]</h5>
                  <p>
                    Hello {ssoUser?.profile?.email}, <br />
                    <br />
                    We successfully authenticated you using your SSO
                    credentials, but it appears your account is currently
                    inactive for Daikon. To gain access, please reach out to a
                    Daikon administrator to have your account activated. Thank
                    you for your understanding.
                  </p>
                  <br />
                  <Button label="Logout" onClick={() => onSignOut()}></Button>
                  {/* <Footer /> */}
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
