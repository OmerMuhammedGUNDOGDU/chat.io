// Uygulamamızın redux store'u oluşturuluyor

import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./rootReducer";

const store = createStore(rootReducer, {}, composeWithDevTools());

export default store;
