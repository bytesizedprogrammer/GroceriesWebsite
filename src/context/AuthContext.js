// https://react.dev/learn/scaling-up-with-reducer-and-context
import React, { createContext, useReducer, useEffect } from "react";

// Initial authentication state
const initialAuth = {
	status: 0, // 0: logged out  |  1: logged in as user | 2: Admin
	email: "", // user email
	userId: -1, // ID for this user, used for database referencing
	isBanned: false, // whether you get to see your private details to edit, should be false upon login, only changed to true when you properly enter password in verifier
	isTimedOut: false,
	cartCount: 0, // self explanatory lolq
	checked: false, // verifier so the API only runs once with correct userId being checked, good for everything including admin page keeping you there on refresh
};

// AuthContext and AuthDispatchContext
export const AuthContext = createContext(null);
export const AuthDispatchContext = createContext(null);

// AuthReducer function
function authReducer(authState, action) {
	switch (action.type) {
		case "login": {
			return {
				...authState,
				status: action.auth.status,
				email: action.auth.email,
				userId: action.auth.userId,
				isBanned: action.auth.isBanned,
				isTimedOut: action.auth.isTimedOut,
				cartCount: action.auth.cartCount,
				checked: true,
			};
		}
		case "logout": {
			return initialAuth;
		}
		case "modify": {
			return {
				...authState,
				...action.auth,
			};
		}
		case "setChecked": {
			return {
				...authState,
				checked: action.checked,
			};
		}
		default: {
			throw Error("Unknown action: " + action.type);
		}
	}
}

// AuthProvider component
export function AuthProvider({ children }) {
	const [authState, dispatch] = useReducer(authReducer, initialAuth);

	useEffect(() => {
		dispatch({ type: "setChecked", checked: false });

		const token = localStorage.getItem("token");
		//console.log("GOTN", token);
		if (token) {
			console.log("Making request");
			fetch("http://localhost:3000/users/verifyToken", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Allow-Control-Allow-Origin": "*",
					"x-access-token": token,
				},
			})
				.then(async (response) => {
          response = await response.json();
					console.log("JSON:", response);
					if (response.status === 500) {
						throw new Error("User Verification Failed (token invalid)");
					}

					if (response.userId) {
						dispatch({
							type: "login",
							auth: {
								status: response.status,
								email: response.email,
								userId: response.userId,
								isBanned: response.isBanned,
								isTimedOut: response.isTimedOut,
								cartCount: response.cartCount
							},
						});
					} else {
						throw new Error("User Verification Failed (no data)");
					}
				}) 
				.catch((err) => {
					//localStorage.removeItem("token");
					dispatch({
						type: "logout",
					});
					console.error(err);
				})
				.finally(() => {
					// After completion of the request (whether success or failure), set checked to true
					dispatch({ type: "setChecked", checked: true });
				});
		} else {
			// If no token, directly set checked to true
			dispatch({ type: "setChecked", checked: true });
		}
	}, []);

	return (
		<AuthContext.Provider value={authState}>
			<AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
		</AuthContext.Provider>
	);
}
