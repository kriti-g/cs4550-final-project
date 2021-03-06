defmodule RoommateApp.Users do
  @moduledoc """
  The Users context.
  """

  import Ecto.Query, warn: false
  alias RoommateApp.Repo

  alias RoommateApp.Users.User

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(User)
    |> Repo.preload([responsibilities: :chore,  invites: :group])
  end

  def list_group_users(group_id) do

    Repo.all(from u in User, where: u.group_id == ^group_id)
    |> Repo.preload([responsibilities: :chore,  invites: :group])


    # Repo.all(User)
    # |> Repo.preload([responsibilities: :chore,  invites: :group])
  end


  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id) do
    Repo.get!(User, id)
    |> Repo.preload([responsibilities: :chore,  invites: :group, location: []])
  end

  def load_resp_chores(%User{} = user) do
    Repo.preload(user, [responsibilities: :chore, invites: :group])
  end

  def get_user_by_email(email) do
    Repo.get_by(User, email: email)
  end

  def authenticate(email, pass) do
    user = Repo.get_by(User, email: email)
    case Argon2.check_pass(user, pass) do
      {:ok, user} -> user
      _ -> nil
    end
  end

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    new = User.changeset(%User{}, attrs)
    Repo.insert(new)
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    IO.inspect([:user_attrs, attrs])
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a user.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end
end
