defmodule RoommateAppWeb.UserController do
  use RoommateAppWeb, :controller

  alias RoommateApp.Users
  alias RoommateApp.Users.User
  alias RoommateApp.Groups
  alias RoommateApp.Invites
  alias RoommateApp.Responsibilities
  alias RoommateAppWeb.Plugs

  plug Plugs.RequireLoggedIn when action in [:show, :update, :delete]
  plug :require_this_user when action in [:show, :update, :delete]

  action_fallback RoommateAppWeb.FallbackController

  # Require the user associated with the session to match the user being
  # accessed.
  def require_this_user(conn, _arg) do
    this_user_id = String.to_integer(conn.params["id"])
    if conn.assigns[:user].id == this_user_id do
      conn
    else
      conn
      |> put_flash(:error, "Accessing a user which doesn't match the session")
      |> redirect(to: Routes.page_path(conn, :index))
    end
  end

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    IO.inspect(user_params)
    case Users.create_user(user_params) do
      {:ok, %User{} = us} ->
        user = Users.load_resp_chores(us)
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.user_path(conn, :show, user))
        |> render("show.json", user: user)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to register new user."}))
    end
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    prev_user = Users.get_user!(id)
    add_to_group_order = user_params["group_id"] != nil && prev_user.group_id == nil
    rem_from_group_order = user_params["group_id"] == -1 && prev_user.group_id != nil
    invalid_transaction = user_params["group_id"] > 0 && prev_user.group_id != nil
    IO.inspect([:booleans, add_to_group_order, rem_from_group_order, invalid_transaction])
    if !invalid_transaction do
      case Users.update_user(prev_user, user_params) do
        {:ok, %User{} = user} ->
          if add_to_group_order do
            group = Groups.get_group!(user.group_id)
            order = Jason.decode!(group.rotation_order)
            new_order = Jason.encode!([ user.id | order ])
            IO.inspect([:add_params, order, new_order])
            Groups.update_group(group, %{"rotation_order" => new_order})
            Invites.delete_all_for_user(user.id)
          end
          if rem_from_group_order do
            group = Groups.get_group!(prev_user.group_id)
            order = Jason.decode!(group.rotation_order)
            new_order = Jason.encode!(order -- [user.id])
            Groups.update_group(group, %{"rotation_order" => new_order})
            Responsibilities.delete_all_for_user(user.id)
          end
          render(conn, "show.json", user: user)
        {:error, _changeset} ->
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(422, Jason.encode!(%{error: "Failed to update user."}))
      end
    else
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to update user."}))
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    case Users.delete_user(user) do
      {:ok, %User{}} ->
        send_resp(conn, :no_content, "")
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to delete user."}))
    end
  end
end
