defmodule RoommateApp.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :name, :string
    field :phone_number, :string
    field :password_hash, :string
    field :location, :string

    belongs_to :group, RoommateApp.Groups.Group
    has_many :responsibilities, RoommateApp.Responsibilities.Responsibility
    has_many :invites, RoommateApp.Invites.Invite


    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    password = attrs["password"]
    group_id = attrs["group_id"]
    user
    |> cast(attrs, [:name, :email, :phone_number])
    |> add_password_hash(password)
    |> add_group_id(group_id)
    |> validate_format(:email, ~r/@/)
    |> validate_required([:name, :email, :password_hash, :phone_number])
    |> unique_constraint(:email)
    |> unique_constraint(:phone_number)
  end

  def add_group_id(cset, nil) do
   cset
  end

  def add_group_id(cset, -1) do
    change(cset, group_id: nil)
  end

  def add_group_id(cset, group_id) do
   change(cset, group_id: group_id)
  end

  def add_password_hash(cset, nil) do
   cset
  end

  def add_password_hash(cset, password) do
   change(cset, Argon2.add_hash(password))
  end
end
