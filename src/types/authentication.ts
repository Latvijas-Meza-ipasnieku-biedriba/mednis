export interface AuthenticateResultIOS {
    access_token: string;
    expires_in: number;
    expires_on: number;
    id_token: string;
    id_token_expires_in: number;
    not_before: number;
    profile_info: string;
    refresh_token: string;
    refresh_token_expires_in: number;
    resource: string;
    scope: string;
    token_type: string;
}
export interface AuthenticateResultAndroid {
    request: {
        configuration: {
            authorizationEndpoint: string;
            tokenEndpoint: string;
        };
        clientId: string;
        grantType: string;
        redirectUri: string;
        authorizationCode: string;
        additionalParameters: string;
    };
    token_type: string;
    access_token: string;
    expires_at: string;
    id_token: string;
    refresh_token: string;
    scope: string;
    additionalParameters: {
        not_before: string;
        expires_on: string;
        resource: string;
        id_token_expires_in: string;
        profile_info: string;
        refresh_token_expires_in: string;
    };
}

export interface Token {
    value: string;
    expiresOn: number;
}

export interface AuthenticationTokens {
    accessToken: Token;
    refreshToken: Token;
}
