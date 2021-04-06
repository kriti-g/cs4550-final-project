defmodule RoommateApp.Chores do
  @moduledoc """
  The Chores context.
  """

  import Ecto.Query, warn: false
  alias RoommateApp.Repo

  alias RoommateApp.Chores.Chore

  @doc """
  Returns the list of chores.

  ## Examples

      iex> list_chores()
      [%Chore{}, ...]

  """
  def list_chores do
    Repo.all(Chore)
    |> Repo.preload([responsibilities: :user])
  end

  @doc """
  Gets a single chore.

  Raises `Ecto.NoResultsError` if the Chore does not exist.

  ## Examples

      iex> get_chore!(123)
      %Chore{}

      iex> get_chore!(456)
      ** (Ecto.NoResultsError)

  """
  def get_chore!(id) do
    Repo.get!(Chore, id)
    |> Repo.preload([responsibilities: :user])
  end

  def load_resp_user(%Chore{} = chore) do
    Repo.preload(chore, [responsibilities: :user])
  end

  @doc """
  Creates a chore.

  ## Examples

      iex> create_chore(%{field: value})
      {:ok, %Chore{}}

      iex> create_chore(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_chore(attrs \\ %{}) do
    %Chore{}
    |> Chore.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a chore.

  ## Examples

      iex> update_chore(chore, %{field: new_value})
      {:ok, %Chore{}}

      iex> update_chore(chore, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_chore(%Chore{} = chore, attrs) do
    chore
    |> Chore.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a chore.

  ## Examples

      iex> delete_chore(chore)
      {:ok, %Chore{}}

      iex> delete_chore(chore)
      {:error, %Ecto.Changeset{}}

  """
  def delete_chore(%Chore{} = chore) do
    Repo.delete(chore)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking chore changes.

  ## Examples

      iex> change_chore(chore)
      %Ecto.Changeset{data: %Chore{}}

  """
  def change_chore(%Chore{} = chore, attrs \\ %{}) do
    Chore.changeset(chore, attrs)
  end
end
