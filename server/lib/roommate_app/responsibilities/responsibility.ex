defmodule RoommateApp.Responsibilities.Responsibility do
  use Ecto.Schema
  import Ecto.Changeset

  schema "responsibilities" do
    field :completions, :integer
    field :deadline, :naive_datetime

    belongs_to :group, RoommateApp.Groups.Group
    belongs_to :user, RoommateApp.Users.User
    belongs_to :chore, RoommateApp.Chores.Chore

    timestamps()
  end

  @doc false
  def changeset(responsibility, attrs) do
    responsibility
    |> cast(attrs, [:completions, :deadline, :group_id, :user_id, :chore_id])
    |> validate_required([:completions, :deadline, :group_id, :user_id, :chore_id])
  end
end
