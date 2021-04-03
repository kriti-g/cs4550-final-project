defmodule RoommateAppWeb.ChoreView do
  use RoommateAppWeb, :view
  alias RoommateAppWeb.ChoreView

  def render("index.json", %{chores: chores}) do
    %{data: render_many(chores, ChoreView, "chore.json")}
  end

  def render("show.json", %{chore: chore}) do
    %{data: render_one(chore, ChoreView, "chore.json")}
  end

  def render("chore.json", %{chore: chore}) do
    %{id: chore.id,
      name: chore.name,
      desc: chore.desc,
      rotation: chore.rotation,
      frequency: chore.frequency,
      responsibilities: render_many(chore.responsibilities, RoommateAppWeb.ResponsibilityView, "responsibility_nochore.json")
    }
  end

  def render("chore_limited.json", %{chore: chore}) do
    %{id: chore.id,
      name: chore.name,
      desc: chore.desc,
      rotation: chore.rotation,
      frequency: chore.frequency
    }
  end
end
