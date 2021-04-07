defmodule RoommateAppWeb.ChoreController do
  use RoommateAppWeb, :controller

  alias RoommateApp.Chores
  alias RoommateApp.Chores.Chore
  alias RoommateAppWeb.Plugs

  plug Plugs.RequireLoggedIn when action in [:show, :update, :delete, :create]
  plug :require_group_member when action in [:show, :update, :delete]

  action_fallback RoommateAppWeb.FallbackController

  def require_group_member(conn, _arg) do
    chore_id = String.to_integer(conn.params["id"])
    chore = Chores.get_chore!(chore_id)
    user = conn.assigns[:user]
    if (chore.group_id == user.group_id) do
      conn
    else
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:unauthorized, Jason.encode!(%{"error" => "You don't have access to this chore."}))
      |> halt()
    end
  end

  def index(conn, _params) do
    chores = Chores.list_chores()
    render(conn, "index.json", chores: chores)
  end

  def create(conn, %{"chore" => chore_params}) do
    user = conn.assigns[:user]
    if is_group_member(user, chore_params) do
      case Chores.create_chore(chore_params) do
        {:ok, %Chore{} = cho} ->
          chore = Chores.load_resp_user(cho)
          conn
          |> put_status(:created)
          |> put_resp_header("location", Routes.chore_path(conn, :show, chore))
          |> render("show.json", chore: chore)
        {:error, _changeset} ->
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(422, Jason.encode!(%{error: "Failed to create new group."}))
      end
    else
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(422, Jason.encode!(%{error: "You don't have access to this group."}))
    end
  end

  def show(conn, %{"id" => id}) do
    chore = Chores.get_chore!(id)
    render(conn, "show.json", chore: chore)
  end

  def update(conn, %{"id" => id, "chore" => chore_params}) do
    chore = Chores.get_chore!(id)

    case Chores.update_chore(chore, chore_params) do
      {:ok, %Chore{} = chore} ->
        render(conn, "show.json", chore: chore)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to create new group."}))
    end
  end

  def delete(conn, %{"id" => id}) do
    chore = Chores.get_chore!(id)

    case Chores.delete_chore(chore) do
      {:ok, %Chore{}} ->
        send_resp(conn, :no_content, "")
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to create new group."}))
    end
  end
end
