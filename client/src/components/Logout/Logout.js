import React, { useEffect }from 'react';
import { useHistory } from "react-router-dom";

const Logout = () => {
    const history = useHistory();
    const callLogout = async () => {
      try {
        const res = await fetch("/logout", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        
        history.push("/signin");
        if (!res.status === 200) {
          const error = new Error(res.error);
          throw error;
        }
      } catch (err) {
        console.log(err);
      }
    };
    useEffect(() => {
      callLogout();
    }, []);
    return (
        <>
        </>
    )
}

export default Logout
