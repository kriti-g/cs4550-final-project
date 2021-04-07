import { Socket } from 'phoenix-socket';
import { fetch_group, fetch_chore } from './api'

let socket = new Socket("ws://localhost:4000/socket", { params: {}});
socket.connect();

let channel = null;
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
  fetch_group(group_id);
  if (resp.chore_id == chore_id) {
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

// set the channel with gamename and join.
export function join_group_channel(gid) {
  group_id = gid;
  channel = socket.channel("live_group:" + group_id, {});
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
// join game. called after gamename is set.
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
