import { useEffect } from "react";

// Runs inside the hidden iframe oidc-client-ts uses for silent token renewal
const SilentRedirect = ({ userManager }) => {
  useEffect(() => {
    userManager.signinSilentCallback().catch(function (err) {
      console.error(err);
    });
  }, [userManager]);

  return null;
};

export default SilentRedirect;
