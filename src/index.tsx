import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClientProvider } from "react-query";
import { App } from "./App";
import { ErrorFallback } from "./pages/errorFallback/ErrorFallback";
import { queryClient } from "./reactQuery";
import "./i18n";
import "leaflet/dist/leaflet.css";
import "./index.scss";

ReactDOM.render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Router>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </Router>
    </ErrorBoundary>,
    document.getElementById("react-root")
);
