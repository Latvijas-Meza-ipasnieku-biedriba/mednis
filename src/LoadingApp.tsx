import * as React from "react";
import { useService } from "@xstate/react";
import { LoadingPage } from "./pages/loading/LoadingPage";
import { PinValidator } from "./pages/pinValidator/PinValidator";
import { authenticationService } from "./utils/authenticationService";

export function LoadingApp() {
    const [state, send] = useService(authenticationService);

    const onPinValid = React.useCallback(() => {
        send({ type: "pinValid" });
    }, [send]);

    const onPinInalid = React.useCallback(() => {
        send({ type: "pinInvalid" });
    }, [send]);

    if (state.matches({ loading: "validatingPin" })) {
        return <PinValidator onValid={onPinValid} onInvalid={onPinInalid} />;
    }

    return <LoadingPage />;
}
