defmodule RoommateAppWeb.GroupController do
  use RoommateAppWeb, :controller

  alias RoommateApp.Groups
  alias RoommateApp.Users
  alias RoommateApp.Groups.Group
  alias RoommateAppWeb.Plugs

  plug Plugs.RequireLoggedIn when action in [:show, :update, :delete, :create]
  plug :require_no_group when action in [:create]
  plug :require_this_group when action in [:show, :update, :delete]

  action_fallback RoommateAppWeb.FallbackController

  # Require the session user to have no assigned group
  def require_no_group(conn, _arg) do
    if conn.assigns[:user].group_id == nil do
      conn
    else
      conn
      |> put_flash(:error, "Leave your current group to make a new group.")
      |> redirect(to: Routes.page_path(conn, :index))
    end
  end

  # Require the session user to be assigned to the group that they are
  # attempting to interact with.
  def require_this_group(conn, _arg) do
    this_group_id = String.to_integer(conn.params["id"])
    if conn.assigns[:user].group_id == this_group_id do
      conn
    else
      conn
      |> put_flash(:error, "You need to be a part of this group.")
      |> redirect(to: Routes.page_path(conn, :index))
    end
  end

  def index(conn, _params) do
    groups = Groups.list_groups()
    render(conn, "index.json", groups: groups)
  end

  def create(conn, %{"group" => group_params}) do
    IO.inspect(group_params)
    case Groups.create_group(group_params) do
      {:ok, %Group{} = grou} ->
        group = Groups.preload_users_chores(grou)
        user = conn.assigns[:user]
        Users.update_user(user, %{"group_id" => group.id})
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.group_path(conn, :show, group))
        |> render("show.json", group: group)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to create new group."}))
    end
  end

  def show(conn, %{"id" => id}) do
    group = Groups.get_group!(id)
    render(conn, "show.json", group: group)
  end

  def update(conn, %{"id" => id, "group" => group_params}) do
    group = Groups.get_group!(id)

    case Groups.update_group(group, group_params) do
      {:ok, %Group{} = group} ->
        render(conn, "show.json", group: group)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to update this group."}))
    end
  end

  def delete(conn, %{"id" => id}) do
    group = Groups.get_group!(id)

    case Groups.delete_group(group) do
      {:ok, %Group{}} ->
        send_resp(conn, :no_content, "")
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to delete this group."}))
    end
  end
end
