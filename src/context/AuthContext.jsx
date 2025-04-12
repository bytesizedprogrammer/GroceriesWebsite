// https://react.dev/learn/scaling-up-with-reducer-and-context
import React, { createContext, useReducer, useEffect } from "react";

// Initial authentication state
const initialAuth = {
	status: 0, // 0: logged out  |  1: logged in as user | 2: Admin
	email: "", // user email
	userId: -1, // ID for this user, used for database referencing
	name: "",
	sentFriendRequests: [],
	receivedFriendRequests: [],
	stores: [],
	//checked: false
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
				name: action.auth.name,
				sentFriendRequests: action.auth.sentFriendRequests,
				receivedFriendRequests: action.auth.receivedFriendRequests,
				stores: action.auth.stores
				// checked: action.auth.checked
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
		/*
		case "setChecked": {
			return {
				...authState,
				checked: action.checked,
			};
		}*/
		default: {
			throw Error("Unknown action: " + action.type);
		}
	}
}

// AuthProvider component
export function AuthProvider({ children }) {
	const [authState, dispatch] = useReducer(authReducer, initialAuth);


	useEffect(() => {
		console.log("AuthState: ", authState);
	}, [authState]);

	/*
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
	}, []);*/

	return (
		<AuthContext.Provider value={authState}>
			<AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
		</AuthContext.Provider>
	);
}
