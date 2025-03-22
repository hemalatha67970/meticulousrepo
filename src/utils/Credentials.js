import Cookies from "js-cookie";
import { SESSION_USERNAME, VALID_PASSWORD, VALID_USERNAMES } from "./Constants";

/**
 * Verify the credentials
 *
 * @param {string} username
 * @param {string} password
 *
 * @return {boolean}
 */
export function verifyCredentials(username, password) {
  if (!username || !password) return false;

  const isValid = password.trim() === VALID_PASSWORD && VALID_USERNAMES.includes(username.trim());
  console.log("Verify Credentials:", { username, password, isValid });
  return isValid;
}

/**
 * Store the data in cookies
 *
 * @param {string} username
 */
export function setCredentials(username) {
  if (!username || username === "locked_out_user") {
    console.warn("Locked-out user cannot log in");
    return;
  }

  // Set cookie expiration (10 minutes)
  Cookies.set(SESSION_USERNAME, username, { expires: 1 / 144 });

  console.log("Set Credentials - Stored Username:", Cookies.get(SESSION_USERNAME));
}

/**
 * Remove the credentials
 */
export function removeCredentials() {
  Cookies.remove(SESSION_USERNAME);
  console.log("Credentials Removed:", Cookies.get(SESSION_USERNAME));
}

/**
 * Return current logged username
 *
 * @return {string | undefined}
 */
export function currentUser() {
  const user = Cookies.get(SESSION_USERNAME) || "";
  console.log("Current User:", user);
  return user;
}

/**
 * Check if this is a problem user
 *
 * @return {boolean}
 */
export function isProblemUser() {
  return currentUser() === "problem_user";
}

/**
 * Check if this is a performance user
 *
 * @return {boolean}
 */
export function isPerformanceGlitchUser() {
  return currentUser() === "performance_glitch_user";
}

/**
 * Check if this a logged-out user
 *
 * @return {boolean}
 */
export function isLockedOutUser() {
  return currentUser() === "locked_out_user";
}

/**
 * Check if this is an error user
 *
 * @return {boolean}
 */
export function isErrorUser() {
  return currentUser() === "error_user";
}

/**
 * Check if the user is logged in with a valid username
 *
 * @return {boolean}
 */
export function isLoggedIn() {
  const sessionUsername = currentUser();
  const isValidUsername = VALID_USERNAMES.includes(sessionUsername);

  console.log("Is Logged In Check:", { sessionUsername, isValidUsername });

  return isValidUsername && sessionUsername !== "locked_out_user";
}

/**
 * Check if this is a visual user
 *
 * @return {boolean}
 */
export function isVisualUser() {
  return currentUser() === "visual_user";
}
