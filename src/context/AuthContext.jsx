// https://react.dev/learn/scaling-up-with-reducer-and-context
import React, { createContext, useReducer, useEffect } from "react";

// Initial authentication state
const initialAuth = {
	status: 0, 
	email: "", 
	userId: -1, 
	name: "",
	sentFriendRequests: [],
	receivedFriendRequests: [],
	stores: [],
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
		default: {
			throw Error("Unknown action: " + action.type);
		}
	}
}

// AuthProvider component
export function AuthProvider({ children }) {
	const [authState, dispatch] = useReducer(authReducer, initialAuth);


	return (
		<AuthContext.Provider value={authState}>
			<AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
		</AuthContext.Provider>
	);
}
