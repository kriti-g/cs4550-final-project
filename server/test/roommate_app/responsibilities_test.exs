defmodule RoommateApp.ResponsibilitiesTest do
  use RoommateApp.DataCase

  alias RoommateApp.Responsibilities

  describe "responsibilities" do
    alias RoommateApp.Responsibilities.Responsibility

    @valid_attrs %{completions: 42, deadline: ~N[2010-04-17 14:00:00]}
    @update_attrs %{completions: 43, deadline: ~N[2011-05-18 15:01:01]}
    @invalid_attrs %{completions: nil, deadline: nil}

    def responsibility_fixture(attrs \\ %{}) do
      {:ok, responsibility} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Responsibilities.create_responsibility()

      responsibility
    end

    test "list_responsibilities/0 returns all responsibilities" do
      responsibility = responsibility_fixture()
      assert Responsibilities.list_responsibilities() == [responsibility]
    end

    test "get_responsibility!/1 returns the responsibility with given id" do
      responsibility = responsibility_fixture()
      assert Responsibilities.get_responsibility!(responsibility.id) == responsibility
    end

    test "create_responsibility/1 with valid data creates a responsibility" do
      assert {:ok, %Responsibility{} = responsibility} = Responsibilities.create_responsibility(@valid_attrs)
      assert responsibility.completions == 42
      assert responsibility.deadline == ~N[2010-04-17 14:00:00]
    end

    test "create_responsibility/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Responsibilities.create_responsibility(@invalid_attrs)
    end

    test "update_responsibility/2 with valid data updates the responsibility" do
      responsibility = responsibility_fixture()
      assert {:ok, %Responsibility{} = responsibility} = Responsibilities.update_responsibility(responsibility, @update_attrs)
      assert responsibility.completions == 43
      assert responsibility.deadline == ~N[2011-05-18 15:01:01]
    end

    test "update_responsibility/2 with invalid data returns error changeset" do
      responsibility = responsibility_fixture()
      assert {:error, %Ecto.Changeset{}} = Responsibilities.update_responsibility(responsibility, @invalid_attrs)
      assert responsibility == Responsibilities.get_responsibility!(responsibility.id)
    end

    test "delete_responsibility/1 deletes the responsibility" do
      responsibility = responsibility_fixture()
      assert {:ok, %Responsibility{}} = Responsibilities.delete_responsibility(responsibility)
      assert_raise Ecto.NoResultsError, fn -> Responsibilities.get_responsibility!(responsibility.id) end
    end

    test "change_responsibility/1 returns a responsibility changeset" do
      responsibility = responsibility_fixture()
      assert %Ecto.Changeset{} = Responsibilities.change_responsibility(responsibility)
    end
  end
end
