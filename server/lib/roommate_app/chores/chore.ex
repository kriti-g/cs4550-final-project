defmodule RoommateApp.Chores.Chore do
  use Ecto.Schema
  import Ecto.Changeset

  schema "chores" do
    field :desc, :string
    field :frequency, :integer
    field :name, :string
    field :rotation, :integer

    belongs_to :group, RoommateApp.Groups.Group
    has_many :responsibilities, RoommateApp.Responsibilities.Responsibility

    timestamps()
  end

  @doc false
  def changeset(chore, attrs) do
    chore
    |> cast(attrs, [:name, :desc, :rotation, :frequency, :group_id])
    |> validate_required([:name, :desc, :rotation, :frequency, :group_id])
  end
end
