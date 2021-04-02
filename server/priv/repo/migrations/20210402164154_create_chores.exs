defmodule RoommateApp.Repo.Migrations.CreateChores do
  use Ecto.Migration

  def change do
    create table(:chores) do
      add :name, :string, null: false
      add :desc, :text, null: false
      add :rotation, :integer, null: false
      add :frequency, :integer, null: false
      add :group_id, references(:groups, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:chores, [:group_id])
  end
end
