defmodule RoommateAppWeb.ChoreControllerTest do
  use RoommateAppWeb.ConnCase

  alias RoommateApp.Chores
  alias RoommateApp.Chores.Chore

  @create_attrs %{
    desc: "some desc",
    frequency: 42,
    name: "some name",
    rotation: 42
  }
  @update_attrs %{
    desc: "some updated desc",
    frequency: 43,
    name: "some updated name",
    rotation: 43
  }
  @invalid_attrs %{desc: nil, frequency: nil, name: nil, rotation: nil}

  def fixture(:chore) do
    {:ok, chore} = Chores.create_chore(@create_attrs)
    chore
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all chores", %{conn: conn} do
      conn = get(conn, Routes.chore_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create chore" do
    test "renders chore when data is valid", %{conn: conn} do
      conn = post(conn, Routes.chore_path(conn, :create), chore: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.chore_path(conn, :show, id))

      assert %{
               "id" => id,
               "desc" => "some desc",
               "frequency" => 42,
               "name" => "some name",
               "rotation" => 42
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.chore_path(conn, :create), chore: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update chore" do
    setup [:create_chore]

    test "renders chore when data is valid", %{conn: conn, chore: %Chore{id: id} = chore} do
      conn = put(conn, Routes.chore_path(conn, :update, chore), chore: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.chore_path(conn, :show, id))

      assert %{
               "id" => id,
               "desc" => "some updated desc",
               "frequency" => 43,
               "name" => "some updated name",
               "rotation" => 43
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, chore: chore} do
      conn = put(conn, Routes.chore_path(conn, :update, chore), chore: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete chore" do
    setup [:create_chore]

    test "deletes chosen chore", %{conn: conn, chore: chore} do
      conn = delete(conn, Routes.chore_path(conn, :delete, chore))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.chore_path(conn, :show, chore))
      end
    end
  end

  defp create_chore(_) do
    chore = fixture(:chore)
    %{chore: chore}
  end
end
