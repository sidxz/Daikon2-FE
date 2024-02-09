import { UserManager } from "oidc-client-ts";
import authConfig from "../../config/authConfig";

const AppUserManager = new UserManager(authConfig);

export default AppUserManager;
