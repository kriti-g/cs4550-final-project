defmodule RoommateAppWeb.InviteController do
  use RoommateAppWeb, :controller

  alias RoommateApp.Invites
  alias RoommateApp.Invites.Invite
  alias RoommateApp.Users
  alias RoommateAppWeb.Plugs

  plug Plugs.RequireLoggedIn when action in [:show, :delete, :create]
  plug :require_invitee_or_group_member when action in [:show, :delete]

  action_fallback RoommateAppWeb.FallbackController

  def require_invitee_or_group_member(conn, _arg) do
    this_invite_id = String.to_integer(conn.params["id"])
    invite = Invites.get_invite!(this_invite_id)
    user = conn.assigns[:user]
    if (invite.group_id == user.group_id || invite.user_id == user.id) do
      conn
    else
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:unauthorized, Jason.encode!(%{"error" => "You don't have access to this invitation."}))
      |> halt()
    end
  end

  def index(conn, _params) do
    invites = Invites.list_invites()
    render(conn, "index.json", invites: invites)
  end

  def create(conn, %{"invite" => invite_paras}) do
    user = conn.assigns[:user]
    email = if invite_paras["user_email"] do
      invite_paras["user_email"]
    else
      ""
    end
    invitee = Users.get_user_by_email(email)
    invite_params = if invitee do
      Map.put(invite_paras, "user_id", invitee.id)
    else
      invite_paras
    end
    error = if invitee do
      "Database failed to create new invite."
    else
      "The email is not linked to a user account."
    end
    if is_group_member(user, invite_params) do
      case Invites.create_invite(invite_params) do
        {:ok, %Invite{} = inv} ->
          invite = Invites.load_group_user(inv)
          conn
          |> put_status(:created)
          |> put_resp_header("location", Routes.invite_path(conn, :show, invite))
          |> render("show.json", invite: invite)
        {:error, _changeset} ->
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(422, Jason.encode!(%{error: error}))
      end
    else
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(422, Jason.encode!(%{error: "No access to this group."}))
    end
  end

  def show(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)
    render(conn, "show.json", invite: invite)
  end

  def delete(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)
    case Invites.delete_invite(invite) do
      {:ok, %Invite{}} ->
        send_resp(conn, :no_content, "")
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to delete this invite."}))
    end
  end

  # def update(conn, %{"id" => id, "invite" => invite_params}) do
  #   invite = Invites.get_invite!(id)
  #
  #   with {:ok, %Invite{} = invite} <- Invites.update_invite(invite, invite_params) do
  #     render(conn, "show.json", invite: invite)
  #   end
  # end
end
