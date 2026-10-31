import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { OIDCConfig } from "../../config/authConfig";

// const AppUserManager = new UserManager(OIDCConfig);

class AppUserManager {
  constructor() {
    //console.log("OIDCConfig", OIDCConfig);
    this.userManager = new UserManager({
      ...OIDCConfig,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    });
  }

  async getUser() {
    return await this.userManager.getUser();
  }

  async signinRedirect() {
    return await this.userManager.signinRedirect();
  }

  async signinRedirectCallback(url) {
    return await this.userManager.signinRedirectCallback(url);
  }

  async signoutRedirect() {
    return await this.userManager.signoutRedirect();
  }

  async signoutRedirectCallback() {
    return await this.userManager.signoutRedirectCallback();
  }

  async signinSilent() {
    return await this.userManager.signinSilent();
  }

  async signinSilentCallback() {
    return await this.userManager.signinSilentCallback();
  }

  async removeUser() {
    return await this.userManager.removeUser();
  }

  async startSilentRenew() {
    return await this.userManager.startSilentRenew();
  }

  async refreshToken() {
    try {
      return await this.userManager.signinSilent();
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }
}

const appUserManager = new AppUserManager();
export default appUserManager;
