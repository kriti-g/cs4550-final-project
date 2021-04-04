defmodule RoommateAppWeb.UserView do
  use RoommateAppWeb, :view
  alias RoommateAppWeb.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      name: user.name,
      email: user.email,
      group_id: user.group_id,
      responsibilities: render_many(user.responsibilities, RoommateAppWeb.ResponsibilityView, "responsibility_nouser.json")
    }
  end

  def render("user_limited.json", %{user: user}) do
    %{id: user.id,
      name: user.name,
      email: user.email,
      group_id: user.group_id,
    }
  end
end
