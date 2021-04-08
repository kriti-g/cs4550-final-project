defmodule RoommateApp.Repo.Migrations.CreateLocations do
  use Ecto.Migration

  def change do
    create table(:locations) do
      add :latitude, :decimal, null: true
      add :longitude, :decimal, null: true
      add :user_id, references(:users, on_delete: :delete_all), null: false

      timestamps()
    end

  end
end
