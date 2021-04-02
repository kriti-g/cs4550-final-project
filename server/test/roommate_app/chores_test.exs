defmodule RoommateApp.ChoresTest do
  use RoommateApp.DataCase

  alias RoommateApp.Chores

  describe "chores" do
    alias RoommateApp.Chores.Chore

    @valid_attrs %{desc: "some desc", frequency: 42, name: "some name", rotation: 42}
    @update_attrs %{desc: "some updated desc", frequency: 43, name: "some updated name", rotation: 43}
    @invalid_attrs %{desc: nil, frequency: nil, name: nil, rotation: nil}

    def chore_fixture(attrs \\ %{}) do
      {:ok, chore} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Chores.create_chore()

      chore
    end

    test "list_chores/0 returns all chores" do
      chore = chore_fixture()
      assert Chores.list_chores() == [chore]
    end

    test "get_chore!/1 returns the chore with given id" do
      chore = chore_fixture()
      assert Chores.get_chore!(chore.id) == chore
    end

    test "create_chore/1 with valid data creates a chore" do
      assert {:ok, %Chore{} = chore} = Chores.create_chore(@valid_attrs)
      assert chore.desc == "some desc"
      assert chore.frequency == 42
      assert chore.name == "some name"
      assert chore.rotation == 42
    end

    test "create_chore/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Chores.create_chore(@invalid_attrs)
    end

    test "update_chore/2 with valid data updates the chore" do
      chore = chore_fixture()
      assert {:ok, %Chore{} = chore} = Chores.update_chore(chore, @update_attrs)
      assert chore.desc == "some updated desc"
      assert chore.frequency == 43
      assert chore.name == "some updated name"
      assert chore.rotation == 43
    end

    test "update_chore/2 with invalid data returns error changeset" do
      chore = chore_fixture()
      assert {:error, %Ecto.Changeset{}} = Chores.update_chore(chore, @invalid_attrs)
      assert chore == Chores.get_chore!(chore.id)
    end

    test "delete_chore/1 deletes the chore" do
      chore = chore_fixture()
      assert {:ok, %Chore{}} = Chores.delete_chore(chore)
      assert_raise Ecto.NoResultsError, fn -> Chores.get_chore!(chore.id) end
    end

    test "change_chore/1 returns a chore changeset" do
      chore = chore_fixture()
      assert %Ecto.Changeset{} = Chores.change_chore(chore)
    end
  end
end
