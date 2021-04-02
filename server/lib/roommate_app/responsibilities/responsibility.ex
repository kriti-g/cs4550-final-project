defmodule RoommateApp.Responsibilities.Responsibility do
  use Ecto.Schema
  import Ecto.Changeset

  schema "responsibilities" do
    field :completions, :integer
    field :deadline, :naive_datetime
    field :user_id, :id
    field :chore_id, :id

    timestamps()
  end

  @doc false
  def changeset(responsibility, attrs) do
    responsibility
    |> cast(attrs, [:completions, :deadline])
    |> validate_required([:completions, :deadline])
  end
end
