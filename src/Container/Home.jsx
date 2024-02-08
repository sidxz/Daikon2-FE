import React, { useEffect, useState } from "react";

const Home = ({ userManager }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Use effect :Home component mounted");
    userManager
      .getUser()
      .then((user) => {
        console.log(user);
        setUser(user);
      })
      .catch(function (err) {
        console.error(err);
      });
  }, [userManager]);

  const signinPopupHandler = async () => {
    try {
      const user = await userManager.signinPopup();
      setUser(user);
      console.log(user);
    } catch (err) {
      console.error(err);
    }
  };

  const signinRedirectHandler = async () => {
    try {
      await userManager.signinRedirect();
    } catch (err) {
      console.error(err);
    }
  };

  const signOutPopupHandler = async () => {
    try {
      await userManager.signoutPopup();
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const signOutRedirectHandler = async () => {
    try {
      await userManager.signoutRedirect();
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(user);
  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <div>
            <p>Welcome, {user.profile.email}!</p>
            <button onClick={signOutPopupHandler}>Popup Logout</button>
            <button onClick={signOutRedirectHandler}>Redirect Logout</button>
          </div>
        ) : (
          <div>
            <button onClick={signinPopupHandler}>Popup Login</button>
            <button onClick={signinRedirectHandler}>Redirect Login</button>
          </div>
        )}
      </header>
    </div>
  );
};

export default Home;
