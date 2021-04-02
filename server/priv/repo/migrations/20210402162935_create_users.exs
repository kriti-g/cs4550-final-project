defmodule RoommateApp.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string
      add :email, :string
      add :password_hash, :string
      add :group_id, references(:groups, on_delete: :nothing)


      timestamps()
    end

  end
end
