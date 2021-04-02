defmodule RoommateAppWeb.UserController do
  use RoommateAppWeb, :controller

  alias RoommateApp.Users
  alias RoommateApp.Users.User
  alias RoommateAppWeb.Plugs

  plug Plugs.RequireLoggedIn when action in [:show, :update, :delete]
  plug :require_this_user when action in [:show, :update, :delete]

  action_fallback RoommateAppWeb.FallbackController

  # Require the user associated with the session to match the user being
  # accessed.
  def require_this_user do
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
    case Users.create_user(user_params) do
      {:ok, %User{} = user} ->
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
    user = Users.get_user!(id)

    case Users.update_user(user, user_params) do
      {:ok, %User{} = user} ->
        render(conn, "show.json", user: user)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to update user."}))
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    case Users.update_user(user, user_params) do
      {:ok, %User{}} ->
        send_resp(conn, :no_content, "")
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to delete user."}))
    end
  end
end
