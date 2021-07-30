import * as React from "react";
import { useRouteMatch, Switch, Route, Redirect } from "react-router-dom";
import { LimitedPrey } from "./LimitedPrey";
import { RegisterPrey } from "./RegisterPrey";
import { UnlimitedPreyForm } from "./UnlimitedPreyForm";
import { reloadPermits } from "../../hooks/usePermitsQuery";
import "./HuntPage.scss";

export function HuntPage() {
    const match = useRouteMatch();

    React.useEffect(() => {
        reloadPermits();
    }, []);

    return (
        <Switch>
            <Route path={`${match.path}/register-prey`} exact>
                <RegisterPrey />
            </Route>
            <Route path={`${match.path}/register-prey/limited/:species`} exact>
                <LimitedPrey />
            </Route>
            <Route path={`${match.path}/register-prey/limited/:species/:subspecies`} exact>
                <LimitedPrey />
            </Route>
            <Route path={`${match.path}/register-prey/limited/:species/injured/:permit`} exact>
                <LimitedPrey />
            </Route>
            <Route path={`${match.path}/register-prey/limited/:species/:subspecies/injured/:permit`} exact>
                <LimitedPrey />
            </Route>
            <Route path={`${match.path}/register-prey/unlimited/:species`} exact>
                <UnlimitedPreyForm />
            </Route>
            <Route path={match.path}>
                <Redirect to={`${match.path}/register-prey`} />
            </Route>
        </Switch>
    );
}
