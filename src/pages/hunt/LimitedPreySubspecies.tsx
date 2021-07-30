import * as React from "react";
import { useHistory } from "react-router-dom";
import { Page, PageContent, PageHeader } from "../../components/Page";
import { LimitedPreyList } from "./PreyList";
import { LimitedSpecies } from "../../types/hunt";

interface LimitedPreySubspeciesProps {
    title: string;
    subspecies: LimitedSpecies[];
}

export function LimitedPreySubspecies(props: LimitedPreySubspeciesProps) {
    const history = useHistory();

    return (
        <Page>
            <PageHeader title={props.title} showBackButton onBackButtonClick={history.goBack} />
            <PageContent>
                <LimitedPreyList species={props.subspecies} type="subspecies" />
            </PageContent>
        </Page>
    );
}
