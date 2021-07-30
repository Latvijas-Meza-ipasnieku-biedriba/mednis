import * as React from "react";
import { useRouteMatch, Switch, Route, Redirect } from "react-router-dom";
import { MemberManagement } from "./MemberManagement/MemberManagement";
import { MtlMenu } from "./MtlMenu";
import { Permits } from "./Permits";
import "./MtlPage.scss";

export function MtlPage() {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={`${match.path}`} exact>
                <MtlMenu />
            </Route>
            <Route path={`${match.path}/manage-members`} exact>
                <MemberManagement />
            </Route>
            <Route path={`${match.path}/permits`} exact>
                <Permits />
            </Route>
            <Route path={match.path}>
                <Redirect to={`${match.path}`} />
            </Route>
        </Switch>
    );
}
