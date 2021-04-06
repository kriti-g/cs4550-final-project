defmodule RoommateAppWeb.GroupView do
  use RoommateAppWeb, :view
  alias RoommateAppWeb.GroupView

  def render("index.json", %{groups: groups}) do
    %{data: render_many(groups, GroupView, "group.json")}
  end

  def render("show.json", %{group: group}) do
    %{data: render_one(group, GroupView, "group.json")}
  end

  def render("group.json", %{group: group}) do
    %{id: group.id,
      name: group.name,
      address: group.address,
      rotation_order: group.rotation_order,
      users: render_many(group.users, RoommateAppWeb.UserView, "user_group.json"),
      chores: render_many(group.chores, RoommateAppWeb.ChoreView, "chore.json"),
      invites: render_many(group.invites, RoommateAppWeb.InviteView, "invite_group.json")
    }
  end

  def render("group_limited.json", %{group: group}) do
    %{id: group.id,
      name: group.name,
      address: group.address,
      rotation_order: group.rotation_order,
    }
  end
end
