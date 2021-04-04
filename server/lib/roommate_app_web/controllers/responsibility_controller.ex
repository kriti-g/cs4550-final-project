defmodule RoommateAppWeb.ResponsibilityController do
  use RoommateAppWeb, :controller

  alias RoommateApp.Responsibilities
  alias RoommateApp.Responsibilities.Responsibility
  alias RoommateAppWeb.Plugs
  alias RoommateApp.Sms

  plug Plugs.RequireLoggedIn when action in [:show, :update, :delete, :create]
  plug :require_group_member when action in [:show, :update, :delete]

  action_fallback RoommateAppWeb.FallbackController

  def require_group_member(conn, _arg) do
    resp_id = String.to_integer(conn.params["id"])
    resp = Responsibilities.get_responsibility!(resp_id)
    user = conn.assigns[:user]
    if (resp.group_id == user.group_id) do
      conn
    else
      conn
      |> put_flash(:error, "You don't have access to this responsibility.")
      |> redirect(to: Routes.page_path(conn, :index))
    end
  end

  def index(conn, _params) do
    responsibilities = Responsibilities.list_responsibilities()
    render(conn, "index.json", responsibilities: responsibilities)
  end

  def create(conn, %{"responsibility" => responsibility_params}) do
    user = conn.assigns[:user]
    if is_group_member(user, responsibility_params) do
      case Responsibilities.create_responsibility(responsibility_params) do
        {:ok, %Responsibility{} = responsibility} ->
          conn
          |> put_status(:created)
          |> put_resp_header("location", Routes.responsibility_path(conn, :show, responsibility))
          |> render("show.json", responsibility: responsibility)
        {:error, _changeset} ->
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(422, Jason.encode!(%{error: "Failed to create new responsibility."}))
      end
    else
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(422, Jason.encode!(%{error: "You aren't a part of this group."}))
    end
  end

  def show(conn, %{"id" => id}) do
    responsibility = Responsibilities.get_responsibility!(id)
    render(conn, "show.json", responsibility: responsibility)
  end

  def update(conn, %{"id" => id, "responsibility" => responsibility_params}) do
    responsibility = Responsibilities.get_responsibility!(id)

    case Responsibilities.update_responsibility(responsibility, responsibility_params) do
      {:ok, %Responsibility{} = responsibility} ->
        render(conn, "show.json", responsibility: responsibility)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to update this responsibility."}))
    end
  end

  def delete(conn, %{"id" => id}) do
    responsibility = Responsibilities.get_responsibility!(id)
    case Responsibilities.delete_responsibility(responsibility) do
      {:ok, %Responsibility{}} ->
        send_resp(conn, :no_content, "")
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to delete this responsibility."}))
    end
  end
end
