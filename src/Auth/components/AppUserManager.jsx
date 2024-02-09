import { UserManager } from "oidc-client-ts";
import { OIDCConfig } from "../../config/authConfig";

const AppUserManager = new UserManager(OIDCConfig);

export default AppUserManager;
