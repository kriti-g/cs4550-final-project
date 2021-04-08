defmodule RoommateAppWeb.LiveGroupChannel do
  use RoommateAppWeb, :channel

  @impl true
  def join("live_group:" <> gid, payload, socket) do
    if authorized?(payload) do
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
    broadcast socket, "location", payload
    {:noreply, socket}
  end

  def handle_in("delete", payload, socket) do
    broadcast socket, "delete", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
