import { createStore, combineReducers, applyMiddleware } from "redux";
// import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import axiosMiddleware from 'redux-axios-middleware';
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { userReducer } from "./user/reducers";
import { requestReducer } from "./request/reducers";
import { updateRequest } from "./request/actions";
import { commonAPI } from "../../service/common-api.service";
//define persistConfig
const persistConfig = {
	key: 'root',
	storage,
}
//combine all reducer
const rootReducer = combineReducers({
	user: userReducer,
	request: requestReducer
});
//define AppState
export type AppState = ReturnType<typeof rootReducer>;
//persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)
//add middleware redux-thunk => could view on chrome browser
// const middlewares = [thunkMiddleware];
let numberOfRequest = 0;
const middlewareConfig = {
	interceptors: {
		request: [{
			success: function ({ getState, dispatch, getSourceAction } : any, req : AxiosRequestConfig) {
				let appState:AppState = getState();
				req.headers.Authorization =  `bearer ${appState.user.currentUser.token}`;
				numberOfRequest++;
				dispatch(updateRequest(numberOfRequest));
				return req;
			},
			error: function ({ getState, dispatch, getSourceAction } : any, error : any) {
				throw error;
			}
		}
		],
		response: [{
			success: function ({ getState, dispatch, getSourceAction } : any, res : AxiosResponse) {
				numberOfRequest--;
				dispatch(updateRequest(numberOfRequest));
				return res;
			},
			error: function ({ getState, dispatch, getSourceAction } : any, error : any) {
				numberOfRequest--;
				dispatch(updateRequest(numberOfRequest));
				throw error;
			}
		}
		]
	}
};
const middleWareEnhancer = applyMiddleware(
	// ...middlewares, 
	axiosMiddleware(commonAPI.api, middlewareConfig)
	);
export default () => {
	let store: any = createStore(
		persistedReducer
		, composeWithDevTools(middleWareEnhancer)
	)
	let persistor = persistStore(store)
	return { store, persistor }
}