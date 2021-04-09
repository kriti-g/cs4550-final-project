// https://github.com/NatTuck/scratch-2021-01/blob/master/notes-4550/18-passwords/notes.md#adding-passwords-to-photoblog-branch-06-passwords
import { createStore, combineReducers } from "redux";
import { clear_channel } from './socket'

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
    case "user/set":
      return action.data;
    default:
      return state;
  }
}

function chore(state = null, action) {
  switch (action.type) {
    case "chore/set":
      return action.data;
    case "chore/clear":
      return null;
    case "group/clear":
      return null;
    default:
      return state;
  }
}

function group(state = null, action) {
  switch (action.type) {
    case "group/set":
      return action.data;
    case "group/clear":
      return null;
    default:
      return state;
  }
}

function responsibility(state = null, action) {
  switch (action.type) {
    case "responsibility/set":
      return action.data;
    case "group/clear":
      return null;
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

function message(state = null, action) {
    switch(action.type) {
        case "message/set":
            return action.data
        case "message/clear":
            return null;
        default:
            return state;
    }
}

function save_session(sess) {
  if (sess) {
    let session = Object.assign({}, sess, { time: Date.now() });
    localStorage.setItem("session", JSON.stringify(session));
  } else {
    localStorage.removeItem("session");
  }
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

/*
session = {
  user_id: user.id,
  name: user.name,
  token: Phoenix.Token.sign(conn, "user_id", user.id)
}
*/
function session(state = restore_session(), action) {
  switch (action.type) {
    case "session/set":
      save_session(action.data);
      return action.data;
    case "session/clear":
      // close socket
      clear_channel()
      // kill the stored session
      save_session(null);
      return null;
    default:
      return state;
  }
}

function root_reducer(state, action) {
  if (action.type === "session/clear") {
    // reset the cache when you log out so that user data isn't shared
    state = undefined;
  }
  let reducer = combineReducers({
    users,
    user,
    chore,
    group,
    responsibility,
    error,
    message,
    session
  });
  return reducer(state, action);
}

let store = createStore(root_reducer);
export default store;
