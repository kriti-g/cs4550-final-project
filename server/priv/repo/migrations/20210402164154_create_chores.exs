defmodule RoommateApp.Repo.Migrations.CreateChores do
  use Ecto.Migration

  def change do
    create table(:chores) do
      add :name, :string
      add :desc, :text
      add :rotation, :integer
      add :frequency, :integer
      add :group_id, references(:groups, on_delete: :delete_all)

      timestamps()
    end

    create index(:chores, [:group_id])
  end
end
