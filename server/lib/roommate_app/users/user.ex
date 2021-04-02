defmodule RoommateApp.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :name, :string
    field :phone_number, :string
    field :password_hash, :string

    belongs_to :group, RoommateApp.Groups.Group

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    password = attrs["password"]
    user
    |> cast(attrs, [:name, :email, :phone_number])
    |> add_password_hash(password)
    |> validate_format(:email, ~r/@/)
    |> validate_required([:name, :email, :password_hash, :phone_number])
    |> unique_constraint(:email)
    |> unique_constraint(:phone_number)
  end

  def add_password_hash(cset, nil) do
   cset
  end

  def add_password_hash(cset, password) do
   change(cset, Argon2.add_hash(password))
  end
end
