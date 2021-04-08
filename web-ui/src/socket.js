import { Socket } from 'phoenix-socket';
import { fetch_group } from './api'

let socket = new Socket("ws://localhost:4000/socket", {
  // no authentication yet just ignore this
  params: {
    token: '123',
  },
});
socket.connect();

let channel = null;
let group_id = null;



function state_update(resp) {
  fetch_group(group_id);
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

export function check_channel() {
  return channel;
}

export function clear_channel() {
  channel = null;
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
  channel.on("update", state_update);
}

export function sendLoc(loc) {
    channel.push("location", loc)
        .receive("ok", resp => { console.log("Location successfully sent", resp) })
        .receive("error", resp => console.log("Error sending location", resp))
}
