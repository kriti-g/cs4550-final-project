defmodule RoommateApp.Chores.Chore do
  use Ecto.Schema
  import Ecto.Changeset

  schema "chores" do
    field :desc, :string
    field :frequency, :integer
    field :name, :string
    field :rotation, :integer
    field :group_id, :id

    timestamps()
  end

  @doc false
  def changeset(chore, attrs) do
    chore
    |> cast(attrs, [:name, :desc, :rotation, :frequency])
    |> validate_required([:name, :desc, :rotation, :frequency])
  end
end
