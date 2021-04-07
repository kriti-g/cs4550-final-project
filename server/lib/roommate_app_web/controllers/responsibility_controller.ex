defmodule RoommateAppWeb.ResponsibilityController do
  use RoommateAppWeb, :controller

  alias RoommateApp.Responsibilities
  alias RoommateApp.Groups
  alias RoommateApp.Responsibilities.Responsibility
  alias RoommateAppWeb.Plugs
  alias RoommateApp.Sms

  plug(Plugs.RequireLoggedIn when action in [:show, :update, :delete, :create])
  plug(:require_group_member when action in [:show, :update, :delete])

  action_fallback(RoommateAppWeb.FallbackController)

  def require_group_member(conn, _arg) do
    resp_id = String.to_integer(conn.params["id"])
    resp = Responsibilities.get_responsibility!(resp_id)
    user = conn.assigns[:user]

    if resp.group_id == user.group_id do
      conn
    else
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:unauthorized, Jason.encode!(%{"error" => "You don't have access to this responsibility."}))
      |> halt()
    end
  end

  def index(conn, _params) do
    responsibilities = Responsibilities.list_responsibilities()
    render(conn, "index.json", responsibilities: responsibilities)
  end

  def get_group_responsibilities(conn, %{"group_id" => id}) do
    IO.inspect([:get_group_RESP, id])
    responsibilities = Responsibilities.list_group_responsibilities(id)

    render(conn, "index.json", responsibilities: responsibilities)
  end

  def create_multiple_responsibilites(conn, %{"responsibility" => responsibility_params}) do
    IO.inspect([:CREATE_RESP_BULK, responsibility_params])
    users = responsibility_params["user_ids"]
    IO.inspect([:userids, users])

    chore_resp = Responsibilities.list_chore_responsibilities(responsibility_params["chore_id"])

    res =
      Enum.reduce(chore_resp, :ok, fn resp, response ->
        # for every users, check if chore_resp.user_id matches
        userResponsible =
          Enum.any?(users, fn u_id ->
            u_id == resp.user_id
          end)

        # means the user was deselected from responsibilities.
        if userResponsible == false do
          IO.inspect([:deleted, resp])
          # delete
          case Responsibilities.delete_responsibility(resp) do
            {:ok, %Responsibility{} = resp} -> :ok
            {:error, _changeset} -> :error
          end
        end
      end)

    res =
      Enum.reduce(users, :ok, fn user_id, response ->
        IO.inspect([:reduce, user_id, response])
        # edit the responsiblity_params to replace user_ids into user_id
        resp_params =
          responsibility_params
          |> Map.delete("user_ids")
          |> Map.put("user_id", user_id)

        # TODO: search if current responsibility exists. if so, update.
        existing_resp =
          Responsibilities.get_responsibility(responsibility_params["chore_id"], user_id)

        IO.inspect([:existing_resp, existing_resp])
        # if it doesn't exist, create new
        if existing_resp == nil do
          case Responsibilities.create_responsibility(resp_params) do
            {:ok, %Responsibility{} = resp} -> :ok
            {:error, _changeset} -> :error
          end
        else
          IO.inspect([:update, existing_resp, resp_params])

          case Responsibilities.update_responsibility(existing_resp, resp_params) do
            {:ok, %Responsibility{} = resp} -> :ok
            {:error, _changeset} -> :error
          end
        end
      end)

    # TODO : CHECK FOR AND DELETE RESPONSIBILITY HERE

    if res == :ok do
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(200, Jason.encode!(%{success: "Responsibilities created."}))
    else
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(422, Jason.encode!(%{error: "Failed to create new responsibility."}))
    end
  end

  def create(conn, %{"responsibility" => responsibility_params}) do
    user = conn.assigns[:user]

    if is_group_member(user, responsibility_params) do
      case Responsibilities.create_responsibility(responsibility_params) do
        {:ok, %Responsibility{} = resp} ->
          responsibility = Responsibilities.load_user_chore(resp)

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

  def update(conn, %{"id" => id, "responsibility" => resp_params}) do
    prev_resp = Responsibilities.get_responsibility!(id)
    finished_rotation = resp_params["completions"] > prev_resp.chore.rotation && prev_resp.chore.rotation != 0

    if finished_rotation do
      group = Groups.get_group!(prev_resp.group_id)
      order = Jason.decode(group.rotation_order)
      next_user_id = get_next_in_rotation(order, prev_resp.user_id) #TODO: write helper
      new_deadline = DateTime.add(DateTime.now("America/New York"), prev_resp.chore.frequency, :hours)
      new_params = %{ "group_id" => group.id, "user_id" => next_user_id, "completions" => 0, "deadline" => new_deadline}
      case Responsibilities.create_responsibility(new_params) do
        {:ok, %Responsibility{} = new_resp} ->
          Responsibilities.delete_responsibility(prev_resp)
          # TODO: send text here
          render(conn, "show.json", responsibility: new_resp)
        {:error, _changeset} ->
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(422, Jason.encode!(%{error: "Failed to update this responsibility."}))
      end
    else
      new_deadline = DateTime.add(DateTime.now("America/New York"), prev_resp.chore.frequency, :hours)
      new_params = Map.put(resp_params, "deadline", new_deadline)
      case Responsibilities.update_responsibility(prev_resp, new_params) do
        {:ok, %Responsibility{} = new_resp} ->
          render(conn, "show.json", responsibility: new_resp)
        {:error, _changeset} ->
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(422, Jason.encode!(%{error: "Failed to update this responsibility."}))
      end
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
