defmodule RoommateApp.Locations.Location do
  use Ecto.Schema
  import Ecto.Changeset

  schema "locations" do
    field :latitude, :float
    field :longitude, :float

    belongs_to :user, RoommateApp.Users.User

    timestamps()
  end

  @doc false
  def changeset(location, attrs) do
    location
    |> cast(attrs, [:latitude, :longitude, :user_id])
    |> validate_required([:latitude, :longitude, :user_id])
  end
end
