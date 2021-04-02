defmodule RoommateAppWeb.ResponsibilityView do
  use RoommateAppWeb, :view
  alias RoommateAppWeb.ResponsibilityView

  def render("index.json", %{responsibilities: responsibilities}) do
    %{data: render_many(responsibilities, ResponsibilityView, "responsibility.json")}
  end

  def render("show.json", %{responsibility: responsibility}) do
    %{data: render_one(responsibility, ResponsibilityView, "responsibility.json")}
  end

  def render("responsibility.json", %{responsibility: responsibility}) do
    %{id: responsibility.id,
      completions: responsibility.completions,
      deadline: responsibility.deadline}
  end
end
