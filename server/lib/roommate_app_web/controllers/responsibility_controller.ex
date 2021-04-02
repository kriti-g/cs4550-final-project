defmodule RoommateAppWeb.ResponsibilityController do
  use RoommateAppWeb, :controller

  alias RoommateApp.Responsibilities
  alias RoommateApp.Responsibilities.Responsibility

  action_fallback RoommateAppWeb.FallbackController

  def index(conn, _params) do
    responsibilities = Responsibilities.list_responsibilities()
    render(conn, "index.json", responsibilities: responsibilities)
  end

  def create(conn, %{"responsibility" => responsibility_params}) do
    with {:ok, %Responsibility{} = responsibility} <- Responsibilities.create_responsibility(responsibility_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.responsibility_path(conn, :show, responsibility))
      |> render("show.json", responsibility: responsibility)
    end
  end

  def show(conn, %{"id" => id}) do
    responsibility = Responsibilities.get_responsibility!(id)
    render(conn, "show.json", responsibility: responsibility)
  end

  def update(conn, %{"id" => id, "responsibility" => responsibility_params}) do
    responsibility = Responsibilities.get_responsibility!(id)

    with {:ok, %Responsibility{} = responsibility} <- Responsibilities.update_responsibility(responsibility, responsibility_params) do
      render(conn, "show.json", responsibility: responsibility)
    end
  end

  def delete(conn, %{"id" => id}) do
    responsibility = Responsibilities.get_responsibility!(id)

    with {:ok, %Responsibility{}} <- Responsibilities.delete_responsibility(responsibility) do
      send_resp(conn, :no_content, "")
    end
  end
end
