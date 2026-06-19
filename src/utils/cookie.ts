/*
MIT License

Copyright (c) 2026 HumberASV
Copyright (c) 2026 Carson Fujita

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * Cookie name used to persist the ASV basestation authentication token.
 * This is an essential functional cookie — it stores a shared access token
 * that is required for WebSocket communication with the basestation.
 * It is not used for personal tracking; multiple users may share the same token.
 */
const COOKIE_NAME = 'asv_token';

/** 30-day lifetime matches a typical token validity window. */
const COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/** Returns the stored token, or an empty string if the cookie is absent. */
export function getTokenFromCookie(): string {
    const match = document.cookie.match(
        new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
    );
    return match ? decodeURIComponent(match[1]) : '';
}

/** Persists the token to a 30-day SameSite cookie accessible to all paths. */
export function setTokenCookie(token: string): void {
    const encoded = encodeURIComponent(token);
    document.cookie = `${COOKIE_NAME}=${encoded}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Strict`;
}

/** Removes the stored token cookie immediately. */
export function clearTokenCookie(): void {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
}
