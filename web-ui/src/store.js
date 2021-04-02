// https://github.com/NatTuck/scratch-2021-01/blob/master/notes-4550/18-passwords/notes.md#adding-passwords-to-photoblog-branch-06-passwords
import { createStore, combineReducers } from "redux";

function users(state = [], action) {
  switch (action.type) {
    case "users/set":
      return action.data;
    default:
      return state;
  }
}

function user(state = null, action) {
  switch (action.type) {
    case "user/get":
      return action.data;
    default:
      return state;
  }
}

function events(state = [], action) {
  switch (action.type) {
    case "events/set":
      return action.data;
    default:
      return state;
  }
}

function event(state = null, action) {
  switch (action.type) {
    case "event/get":
      return action.data;
    default:
      return state;
  }
}

function user_form(state = {}, action) {
  switch (action.type) {
    case "user_form/set":
      return action.data;
    default:
      return state;
  }
}

function error(state = null, action) {
  switch (action.type) {
    case "session/set":
      return null;
    case "error/set":
      return action.data;
    default:
      return state;
  }
}

function save_session(sess) {
  let session = Object.assign({}, sess, { time: Date.now() });
  localStorage.setItem("session", JSON.stringify(session));
}

function restore_session() {
  let session = localStorage.getItem("session");
  if (!session) {
    return null;
  }
  session = JSON.parse(session);
  let age = Date.now() - session.time;
  let hours = 60 * 60 * 1000;
  if (age < 24 * hours) {
    return session;
  } else {
    return null;
  }
}

function session(state = restore_session(), action) {
  switch (action.type) {
    case "session/set":
      save_session(action.data);
      return action.data;
    case "session/clear":
      return null;
    default:
      return state;
  }
}

function root_reducer(state, action) {
  console.log("root_reducer", state, action);
  let reducer = combineReducers({
    users,
    user,
    user_form,
    events,
    event,
    error,
    session
  });
  return reducer(state, action);
}

let store = createStore(root_reducer);
export default store;
