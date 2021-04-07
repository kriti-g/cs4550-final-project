import Phoenix, { setPhoenixSocket } from 'react-phoenix-socket';
import { Socket } from 'phoenix-socket';
import { fetch_group } from './api'

let socket = new Socket("ws://localhost:4000/socket", {
  // no authentication just ignore this
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

// set the channel with gamename and join.
export function join_group_channel(gid) {
  group_id = gid;
  channel = socket.channel("live_group:" + group_id, {});
  join_group_channel();
}

export function channel_signal() {
  channel.push("update", {})
}

// join game. called after gamename is set.
export function join_group_channel() {
  channel
    .join()
    .receive("ok", (resp) => {
      console.log("Joined", resp);
    })
    .receive("error", (resp) => {
      console.log("Unable to join", resp);
    });

  // bind to listen to broadcasts.
  channel.on("view", state_update);
}
