defmodule RoommateAppWeb.LiveGroupChannel do
  use RoommateAppWeb, :channel

  @impl true
  def join("live_group:" <> gid, payload, socket) do
    if authorized?(payload) do
      socket = socket
               |> assign(:user_id, payload["user"])
               |> assign(:group_id, gid)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (live_group:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  @impl true
  def handle_in("update", payload, socket) do
    broadcast socket, "update", payload
    {:noreply, socket}
  end
  
  @impl true
  def handle_in("location", payload, socket) do
    user = RoommateApp.Users.get_user!(socket.assigns[:user_id])
    if !user.location do
      loc_params = %{"user_id" => user.id, "latitude" => payload["latitude"], "longitude" => payload["longitude"]}
      RoommateApp.Locations.create_location(loc_params)
    else
      RoommateApp.Locations.update_location(user.location, %{"latitude" => payload["latitude"], "longitude" => payload["longitude"]})
    end
    chore = RoommateApp.get_chore!(payload["chore"])
    notify_payload = RoommateAppWeb.Helpers.check_nearby(chore)
                     |> Enum.reduce(%{user_ids: [], users: [], chore: chore}, fn usr, acc-> 
                       acc
                       |> Map.update("user_ids", acc.user_ids ++ usr.id)
                       |> Map.update("users", acc.users ++ usr.name) 
                     end)
    broadcast(socket, "nearby", notify_payload)
    {:noreply, socket}
  end

  def handle_in("delete", payload, socket) do
    broadcast socket, "delete", payload
    {:noreply, socket}
  end

  intercept ["nearby"]

  def handle_out("nearby", payload, socket) do
    if Enum.any?(payload.user_ids, fn id -> id == socket.assigns[:user_id] end)
      push(socket, "nearby", %{ users: payload.users, chore: payload.chore })
      {:noreply, socket}
    else
      {:noreply, socket}
    end
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
