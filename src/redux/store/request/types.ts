export const UPDATE_REQUEST = "UPDATE_REQUEST";
export const UPDATE_ALERT = "UPDATE_ALERT";

export interface UpdateRequestsAction {
  type: typeof UPDATE_REQUEST;
  payload: number;
}

interface UpdateAlertsAction {
  type: typeof UPDATE_ALERT;
  payload: any;
}

export type RequestActionTypes = UpdateRequestsAction | UpdateAlertsAction;
