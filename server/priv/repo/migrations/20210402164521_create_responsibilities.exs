defmodule RoommateApp.Repo.Migrations.CreateResponsibilities do
  use Ecto.Migration

  def change do
    create table(:responsibilities) do
      add :completions, :integer, null: false
      add :deadline, :naive_datetime, null: false
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :chore_id, references(:chores, on_delete: :delete_all), null: false
      add :group_id, references(:groups, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:responsibilities, [:user_id])
    create index(:responsibilities, [:chore_id])
  end
end
