import React , {useMemo}from 'react'
import {io} from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";
import conf from "../conf/conf";
const SocketContext = React.createContext(null);

export const useSocket = () => {
    return React.useContext(SocketContext);
}

export const SocketProvider = (props) => {
    const {getAccessTokenSilently} = useAuth0();
    
    const socket = useMemo(
        () => 
            io(`${conf.path}`, {
          withCredentials: true,
          autoConnect:true,
          auth: (callback) => {
        getAccessTokenSilently({
          authorizationParams: {
            audience: "https://workflow-builder-api",
          },
        })
          .then((token) => callback({ token }))
          .catch((error) => {
            console.error("Failed to get access token:", error);
            callback({});
          });
      },
            }),
            
        
         
            [getAccessTokenSilently]
    );
    return (
        <SocketContext.Provider value ={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}


