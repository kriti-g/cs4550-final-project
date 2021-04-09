import { Socket } from 'phoenix-socket';
import { fetch_group, fetch_chore, fetch_user } from './api'
import store from "./store";

let socket = new Socket("wss://roommate.gkriti.art/socket", { params: {}});
socket.connect();

let channel = null;
let user_id = null;
let group_id = null;
let chore_id = null;

export function check_channel() {
  return channel;
}
export function clear_channel() {
  channel = null;
}

export function check_chore() {
  return chore_id;
}

export function set_chore(cid) {
  chore_id = cid
}

function state_update(resp) {
  fetch_user(user_id);
  fetch_group(group_id);
  if (resp.chore_id === chore_id) {
    chore_id = "deleted"
  }
  if (chore_id && chore_id !== "deleted") {
    fetch_chore(chore_id)
  }
}

export function gen_socket(uid, token) {
  socket = new Socket("ws://localhost:4000/socket", {
    params: {
      user_id: uid,
      token: token,
    },
  });
  socket.connect();
}

export function listen_for_deletions(cb) {
  channel.on("delete", cb);
}

// set the channel with gid and join
export function join_group_channel(uid, gid) {
  user_id = uid;
  group_id = gid;
  channel = socket.channel("live_group:" + group_id, {user: user_id});
  join_group();
}

export function channel_signal() {
  channel.push("update", {})
}

export function reset_cb_bindings() {
  channel.off("delete");
  channel.off("update");
  channel.on("delete", state_update);
  channel.on("update", state_update);
}

export function channel_signal_deletion(cid) {
  console.log("choreid", cid)
  channel.push("delete", { chore_id: cid })
}
// join game. called after group id is set
export function join_group() {
  channel
    .join()
    .receive("ok", (resp) => {
      console.log("Joined", resp);
    })
    .receive("error", (resp) => {
      console.log("Unable to join", resp);
    });

  // bind to listen to broadcasts.
  channel.on("delete", state_update);
  channel.on("update", state_update);
}

export function sendLoc(loc) {
    channel.push("location", loc)
        .receive("ok", resp => { console.log("Location successfully sent", resp) })
        .receive("error", resp => console.log("Error sending location", resp))
    channel.on("nearby", payload => {
        store.dispatch({type: "message/set", data: payload})
})
}
