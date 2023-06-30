import { Button } from "primereact/button";
import "./DefaultLogin.css";

const DefaultLogin = ({ loginButtonClicked }) => {
  return (
    <div className="BackgroundLogin">
      {/* <div className="LoginLeft">
        <div className="centered"></div>
      </div> */}

      <div className="LoginRight">
        <div className="LoginCentered">
          <div className="LoginLanding">
            <div>
              <div className="LoginLoginBox" id="loginButton">
                <h1>D A I K O N</h1>

                <h5>[LOGIN]</h5>
                <p>
                  This computer system and the data herein are available only
                  for authorized purposes by authorized users: use for any other
                  purpose is prohibited and may result in administrative/
                  disciplinary actions or criminal prosecution against the user.
                  Usage may be subject to security testing and monitoring to
                  ensure compliance with the policies of the Organization. There
                  is no expectation of privacy on this system except as
                  otherwise provided by applicable privacy laws. Users should
                  refer to Rules for Responsible Computing, for guidance on the
                  appropriate use of the Organization's information resources.
                </p>
                <br />
                <Button
                  label="Login with SSO"
                  onClick={() => loginButtonClicked()}
                ></Button>
                {/* <Footer /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLogin;
