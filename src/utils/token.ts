import { Token } from "../types/authentication";

export function isTokenValid(token: Token) {
    return token.expiresOn > new Date().getTime();
}
