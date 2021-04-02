defmodule RoommateApp.Repo.Migrations.CreateResponsibilities do
  use Ecto.Migration

  def change do
    create table(:responsibilities) do
      add :completions, :integer
      add :deadline, :naive_datetime
      add :user_id, references(:users, on_delete: :delete_all)
      add :chore_id, references(:chores, on_delete: :delete_all)

      timestamps()
    end

    create index(:responsibilities, [:user_id])
    create index(:responsibilities, [:chore_id])
  end
end
