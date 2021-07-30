import * as React from "react";
import { Network } from "@capacitor/core";

export function useNetworkConnected() {
    const [networkConnected, setNetworkConnected] = React.useState(true);

    React.useEffect(() => {
        const handle = Network.addListener("networkStatusChange", (status) => {
            setNetworkConnected(status.connected);
        });

        return () => {
            handle.remove();
        };
    }, []);

    return networkConnected;
}
