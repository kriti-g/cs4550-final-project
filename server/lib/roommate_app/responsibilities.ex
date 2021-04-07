defmodule RoommateApp.Responsibilities do
  @moduledoc """
  The Responsibilities context.
  """

  import Ecto.Query, warn: false
  alias RoommateApp.Repo

  alias RoommateApp.Responsibilities.Responsibility

  @doc """
  Returns the list of responsibilities.

  ## Examples

      iex> list_responsibilities()
      [%Responsibility{}, ...]

  """
  def list_responsibilities do
    Repo.all(Responsibility)
    |> Repo.preload([:user, :chore])
  end

  def load_user_chore(%Responsibility{} = resp) do
    Repo.preload(resp, [:user, :chore])
  end

  def delete_all_for_user(uid) do
    from(resp in Responsibility, where: resp.user_id == ^uid)
    |> Repo.delete_all
  end

  @doc """
  Gets a single responsibility.

  Raises `Ecto.NoResultsError` if the Responsibility does not exist.

  ## Examples

      iex> get_responsibility!(123)
      %Responsibility{}

      iex> get_responsibility!(456)
      ** (Ecto.NoResultsError)

  """
  def get_responsibility!(id) do
    Repo.get!(Responsibility, id)
    |> Repo.preload([:user, :chore])
  end

  @doc """
  Creates a responsibility.

  ## Examples

      iex> create_responsibility(%{field: value})
      {:ok, %Responsibility{}}

      iex> create_responsibility(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def list_group_responsibilities(group_id) do

    Repo.all(from r in Responsibility, where: r.group_id == ^group_id)
    # |> Repo.preload([responsibilities: :chore,  invites: :group])
    # TODO : NEED TO PRELOAD SMT
  end

  def list_chore_responsibilities(chore_id) do
    Repo.all(from r in Responsibility, where: r.chore_id == ^chore_id)
  end

  def create_responsibility(attrs \\ %{}) do
    %Responsibility{}
    |> Responsibility.changeset(attrs)
    |> Repo.insert()
  end

  def get_responsibility(chore_id, user_id) do
    Repo.one(from r in Responsibility, where: r.chore_id == ^chore_id and r.user_id == ^user_id )
  end
  @doc """
  Updates a responsibility.

  ## Examples

      iex> update_responsibility(responsibility, %{field: new_value})
      {:ok, %Responsibility{}}

      iex> update_responsibility(responsibility, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_responsibility(%Responsibility{} = responsibility, attrs) do
    responsibility
    |> Responsibility.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a responsibility.

  ## Examples

      iex> delete_responsibility(responsibility)
      {:ok, %Responsibility{}}

      iex> delete_responsibility(responsibility)
      {:error, %Ecto.Changeset{}}

  """
  def delete_responsibility(%Responsibility{} = responsibility) do
    Repo.delete(responsibility)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking responsibility changes.

  ## Examples

      iex> change_responsibility(responsibility)
      %Ecto.Changeset{data: %Responsibility{}}

  """
  def change_responsibility(%Responsibility{} = responsibility, attrs \\ %{}) do
    Responsibility.changeset(responsibility, attrs)
  end
end
