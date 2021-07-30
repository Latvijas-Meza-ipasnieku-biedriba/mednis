import axios from "axios";
import { configuration } from "../configuration";
import { authenticationService } from "./authenticationService";

export const client = axios.create({
    baseURL: configuration.api.url,
});

// Add token and default timeout to all requests
client.interceptors.request.use(
    (config) => {
        const accessToken = authenticationService.state.context.tokens?.accessToken.value;
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        config.timeout = 30000;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle unauthorized responses
client.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401 && !error.config._retry) {
            // Refresh token and retry request
            if (authenticationService.state.matches({ loggedIn: "idle" })) {
                authenticationService.send({ type: "refreshSession" });

                authenticationService.onTransition((state) => {
                    if (state.matches({ loggedIn: "idle" })) {
                        error.config._retry = true;
                        return client(error.config);
                    }

                    return Promise.reject(error);
                });

                return;
            }

            // Wait for token to be refreshed and retry request
            if (authenticationService.state.matches({ loggedIn: "refreshing" })) {
                authenticationService.onTransition((state) => {
                    if (state.matches({ loggedIn: "idle" })) {
                        error.config._retry = true;
                        return client(error.config);
                    }

                    return Promise.reject(error);
                });

                return;
            }
        }

        return Promise.reject(error);
    }
);
