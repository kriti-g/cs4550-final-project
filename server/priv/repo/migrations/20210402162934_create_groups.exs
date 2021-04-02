defmodule RoommateApp.Repo.Migrations.CreateGroups do
  use Ecto.Migration

  def change do
    create table(:groups) do
      add :name, :string
      add :address, :string
      add :rotation_order, :string

      timestamps()
    end

  end
end
