import store from "./store";

export async function api_get(path) {
  let text = await fetch("http://localhost:4000/api/v1" + path, {});
  let resp = await text.json();
  return resp.data;
}

async function api_post(path, data) {
  let opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  let text = await fetch("http://localhost:4000/api/v1" + path, opts);
  return await text.json();
}

async function api_patch(path, data) {
  let opts = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  let text = await fetch("http://localhost:4000/api/v1" + path, opts);
  return await text.json();
}

async function api_delete(path, data) {
  let opts = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  let text = await fetch("http://localhost:4000/api/v1" + path, opts);
  return await text;
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
      type: "user/get",
      data: data,
    })
  );
}

export function fetch_roommate_group(id) {
  api_get("/rmgroup/" + id).then((data) =>
    store.dispatch({
      type: "rmgroup/get",
      data: data,
    })
  );
}

export function fetch_chores() {
  api_get("/chores/").then((data) =>
    store.dispatch({
      type: "chores/get",
      data: data,
    })
  );
}

export function fetch_chore(id) {
  api_get("/chores/" + id).then((data) =>
    store.dispatch({
      type: "chore/get",
      data: data,
    })
  );
}

export function fetch_responsibility(id) {
  api_get("/responsibilities/" + id).then((data) =>
    store.dispatch({
      type: "responsibility/get",
      data: data,
    })
  );
}

export function fetch_responsibilities() {
  api_get("/responsibility/").then((data) =>
    store.dispatch({
      type: "responsibility/get",
      data: data,
    })
  );
}

// --- relic
export function fetch_events() {
  api_get("/events").then((data) =>
    store.dispatch({
      type: "events/set",
      data: data,
    })
  );
}

export function fetch_event(id) {
  api_get("/events/" + id).then((data) =>
    store.dispatch({
      type: "event/get",
      data: data,
    })
  );
}

export function load_defaults() {
  // TODO: change this out.
  //   fetch_users();
  fetch_events();
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
export function create_user(user) {
  return api_post("/users", { user });
}

export function create_event(event) {
  return api_post("/events", { event });
}

export function create_invitee(invitee) {
  return api_post("/invitees", { invitee });
}

export function update_invitee(invitee) {
  return api_patch("/invitees/" + invitee.id, { invitee });
}

export function update_event(event) {
  return api_patch("/events/" + event.id, { event });
}

export function update_user(user) {
  return api_patch("/users/" + user.id, { user });
}

export function delete_comment(comment_id) {
  return api_delete("/comments/" + comment_id, { id: comment_id });
}
