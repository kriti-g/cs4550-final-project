defmodule RoommateAppWeb.InviteView do
  use RoommateAppWeb, :view
  alias RoommateAppWeb.InviteView

  def render("index.json", %{invites: invites}) do
    %{data: render_many(invites, InviteView, "invite.json")}
  end

  def render("show.json", %{invite: invite}) do
    %{data: render_one(invite, InviteView, "invite.json")}
  end

  def render("invite.json", %{invite: invite}) do
    %{id: invite.id,
      group: render_one(invite.group, RoommateAppWeb.GroupView, "group_limited.json"),
      user: render_one(invite.user, RoommateAppWeb.UserView, "user_limited.json")}
  end

  def render("invite_user.json", %{invite: invite}) do
    %{id: invite.id,
      group: render_one(invite.group, RoommateAppWeb.GroupView, "group_limited.json"),
      user_id: invite.user_id}
  end

  def render("invite_group.json", %{invite: invite}) do
    %{id: invite.id,
      group_id: invite.group_id,
      user: render_one(invite.user, RoommateAppWeb.UserView, "user_limited.json")}
  end
end
