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
  def get_responsibility!(id), do: Repo.get!(Responsibility, id)

  @doc """
  Creates a responsibility.

  ## Examples

      iex> create_responsibility(%{field: value})
      {:ok, %Responsibility{}}

      iex> create_responsibility(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_responsibility(attrs \\ %{}) do
    %Responsibility{}
    |> Responsibility.changeset(attrs)
    |> Repo.insert()
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
