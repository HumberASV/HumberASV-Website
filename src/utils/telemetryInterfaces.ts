/*

All interfaces related to telemetry data and components are defined in this file. This includes the structure of telemetry data, as well as any props that telemetry components may require.

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
 * Token interface for the Connect page. 
 * This is used to store the token entered by the user to connect to the basestation.
 */
type Token = {
    token: string;
};

const initialTokenState: Token = {
    token: '',
};

export const checkToken = (token: string): boolean => {
    // Check if the token is valid (for now, just check if it's not empty)
    return token.trim() !== '';
};

export { initialTokenState };
export type { Token };