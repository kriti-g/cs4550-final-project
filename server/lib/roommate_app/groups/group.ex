defmodule RoommateApp.Groups.Group do
  use Ecto.Schema
  import Ecto.Changeset

  schema "groups" do
    field :address, :string
    field :name, :string
    field :rotation_order, :string

    has_many :users, RoommateApp.Users.User, on_delete: :nothing
    has_many :chores, RoommateApp.Chores.Chore

    timestamps()
  end

  @doc false
  def changeset(group, attrs) do
    group
    |> cast(attrs, [:name, :address, :rotation_order])
    |> validate_required([:name, :address, :rotation_order])
  end
end
