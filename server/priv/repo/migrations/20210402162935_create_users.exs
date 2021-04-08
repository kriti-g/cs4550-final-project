defmodule RoommateApp.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string, null: false
      add :email, :string, null: false
      add :phone_number, :string, null: false
      add :password_hash, :string, null: false
      add :location, :string, null: true
      add :group_id, references(:groups, on_delete: :nothing), null: true


      timestamps()
    end

    create unique_index(:users, [:email])
    create unique_index(:users, [:phone_number])

  end
end
