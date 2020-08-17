import { UpdateRequestsAction, UPDATE_REQUEST, UPDATE_ALERT } from "./types";

export function updateRequest(noRequests: number): UpdateRequestsAction {
	return {
		type: UPDATE_REQUEST,
		payload: noRequests
	};
}

export function updateAlert(alert: any) {
	return {
		type: UPDATE_ALERT,
		payload: alert
	}
}

