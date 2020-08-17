import {
	UPDATE_REQUEST,
	UPDATE_ALERT,
	RequestActionTypes
} from "./types";

const initialState = {
	numberOfRequest: 0,
	alertConfig: {}
}

export function requestReducer(
	state = initialState,
	action: RequestActionTypes
): any {
	switch (action.type) {
		case UPDATE_REQUEST:
			return {
				...state, numberOfRequest: action.payload
			};
		case UPDATE_ALERT:
			return {
				...state, alertConfig: action.payload
			}
		default:
			return state;
	}
}
