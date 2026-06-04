/**
 * Token interface for the Connect page. 
 * 
 * @remarks
 * - This is used to store the token entered by the user to connect to the basestation.
 * @see {@link initialTokenState}
 * @author Carson Fujita
 */
type Token = {
    token: string;
};

/**
 * Initial state for the token. 
 * @see {@link Token}
 * @remarks
 * - This is used in the Redux store to manage the token state.
 */
const initialTokenState: Token = {
    token: '',
};

/**
 * Checks if the provided token is valid.
 * @param token the {@link Token} value
 * @returns true if the token is valid, false otherwise
 */
const checkToken = (token: Token): boolean => {
    // Check if the token is valid (for now, just check if it's not empty)
    return token.token.trim() !== '';
};

export type { Token };
export { initialTokenState, checkToken };