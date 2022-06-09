import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import loginReducer from "./services/loginReducer";
import { connectRouter } from "connected-react-router";
import Post from "./services/postReducer";
import Image from "./services/imageReducer";
import commentReducer from "./services/commentReducer";
import favoriteReducer from "./services/favoriteReducer";

export const history = createBrowserHistory();

const rootReducer = combineReducers({
  user: loginReducer,
  router: connectRouter(history),
  post: Post,
  image: Image,
  comment: commentReducer,
  favorite: favoriteReducer,
});

const middlewares = [thunk.withExtraArgument({ history: history })];

// 현재 환경
const env = process.env.NODE_ENV;

// 개발환경에서는 로거라는 것
if (env === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(applyMiddleware(...middlewares));

let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();
