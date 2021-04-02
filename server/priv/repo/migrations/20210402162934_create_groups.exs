defmodule RoommateApp.Repo.Migrations.CreateGroups do
  use Ecto.Migration

  def change do
    create table(:groups) do
      add :name, :string, null: false
      add :address, :string, null: false
      add :rotation_order, :string, null: false

      timestamps()
    end

  end
end
