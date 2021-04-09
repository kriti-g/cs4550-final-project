import store from "./store";

const url = "https://roommate.gkriti.art/api/v1"
// get the current session token if there is one.
function session_token() {
  let state = store.getState();
  return state?.session?.token;
}

export async function api_get(path) {
  let stoken = session_token();
  let opts = {
    method: "GET",
    headers: {
      "Session-Token": stoken,
    },
  };
  let text = await fetch(url + path, opts);
  let resp = await text.json();
  return resp.data;
}

async function api_post(path, data) {
  let stoken = session_token();
  let opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Session-Token": stoken,
    },
    body: JSON.stringify(data),
  };
  let text = await fetch(url + path, opts);
  return await text.json();
}

async function api_patch(path, data) {
  let stoken = session_token();
  let opts = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Session-Token": stoken,
    },
    body: JSON.stringify(data),
  };

  let text = await fetch(url + path, opts);
  return await text.json();
}

async function api_delete(path, data) {
  let stoken = session_token();
  let opts = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Session-Token": stoken,
    },
    body: JSON.stringify(data),
  };

  let text = await fetch(url + path, opts);
  return text;
}

// TODO:  fetch functions may change over time depending on need.
export function fetch_users() {
  api_get("/users").then((data) =>
    store.dispatch({
      type: "users/set",
      data: data,
    })
  );
}

export function fetch_user(id) {
  api_get("/users/" + id).then((data) =>
    store.dispatch({
      type: "user/set",
      data: data,
    })
  );
}

export function fetch_group(id) {
    api_get("/groups/" + id).then((data) => {
      // to prevent it from breaking on post-group-leave broadcast
      if (data) {
        store.dispatch({
          type: "group/set",
          data: data,
        })
      }
    });
}

export function fetch_chores() {
  api_get("/chores/").then((data) =>
    store.dispatch({
      type: "chores/set",
      data: data,
    })
  );
}

export function fetch_chore(id) {
  api_get("/chores/" + id).then((data) =>
    store.dispatch({
      type: "chore/set",
      data: data,
    })
  );
}

export function fetch_responsibility(id) {
  api_get("/responsibilities/" + id).then((data) =>
    store.dispatch({
      type: "responsibility/set",
      data: data,
    })
  );
}

export function fetch_responsibilities() {
  api_get("/responsibilities").then((data) =>
    store.dispatch({
      type: "responsibilities/set",
      data: data,
    })
  );
}

export function load_defaults() {
  fetch_users();
}

//   https://github.com/NatTuck/scratch-2021-01/blob/master/notes-4550/18-passwords/notes.md#adding-passwords-to-photoblog-branch-06-passwords
export function api_login(email, password) {
  api_post("/session", { email, password }).then((data) => {
    console.log("login resp", data);
    if (data.session) {
      let action = {
        type: "session/set",
        data: data.session,
      };
      store.dispatch(action);
    } else if (data.error) {
      let action = {
        type: "error/set",
        data: data.error,
      };
      store.dispatch(action);
    }
  });
}

export function refresh_session() {}

export function get_session() {
  return store.getState().session;
}
export async function create_user(user) {
  return await api_post("/users", { user });
}

export async function create_group(group) {
  return api_post("/groups", { group });
}

export async function create_chore(chore) {
  return api_post("/chores", { chore });
}

export async function create_responsibility(responsibility) {
  return api_post("/responsibilities", { responsibility });
}

// used for creating a responsibility obj with multiple user ids.
// server will automatically create multiple or update existing .
export async function create_bulk_responsibilites(responsibility) {
  return api_post("/responsibilities/bulkCreate", { responsibility });
}

// used for marking a responsibility obj complete.
// server will update all other responsibilities for that chore.
export async function update_bulk_responsibilites(responsibility) {
  return api_post("/responsibilities/bulkUpdate", { responsibility });
}

export async function create_invite(invite) {
  return api_post("/invites", { invite });
}

export async function update_group(group) {
  return api_patch("/groups/" + group.id, { group });
}

export async function update_chore(chore) {
  return api_patch("/chores/" + chore.id, { chore });
}

export async function update_user(user) {
  return api_patch("/users/" + user.id, { user });
}

export async function update_responsibility(responsibility) {
  return api_patch("/responsibilities/" + responsibility.id, {
    responsibility,
  });
}

export async function delete_invite(invite_id) {
  return api_delete("/invites/" + invite_id, { id: invite_id });
}

export async function delete_group(group_id) {
  return api_delete("/groups/" + group_id, { id: group_id });
}

export async function delete_chore(chore_id) {
  return api_delete("/chores/" + chore_id, { id: chore_id });
}

export async function delete_responsibility(responsibility_id) {
  return api_delete("/responsibilities/" + responsibility_id, {
    id: responsibility_id,
  });
}
