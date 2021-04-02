defmodule RoommateAppWeb.ResponsibilityControllerTest do
  use RoommateAppWeb.ConnCase

  alias RoommateApp.Responsibilities
  alias RoommateApp.Responsibilities.Responsibility

  @create_attrs %{
    completions: 42,
    deadline: ~N[2010-04-17 14:00:00]
  }
  @update_attrs %{
    completions: 43,
    deadline: ~N[2011-05-18 15:01:01]
  }
  @invalid_attrs %{completions: nil, deadline: nil}

  def fixture(:responsibility) do
    {:ok, responsibility} = Responsibilities.create_responsibility(@create_attrs)
    responsibility
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all responsibilities", %{conn: conn} do
      conn = get(conn, Routes.responsibility_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create responsibility" do
    test "renders responsibility when data is valid", %{conn: conn} do
      conn = post(conn, Routes.responsibility_path(conn, :create), responsibility: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.responsibility_path(conn, :show, id))

      assert %{
               "id" => id,
               "completions" => 42,
               "deadline" => "2010-04-17T14:00:00"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.responsibility_path(conn, :create), responsibility: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update responsibility" do
    setup [:create_responsibility]

    test "renders responsibility when data is valid", %{conn: conn, responsibility: %Responsibility{id: id} = responsibility} do
      conn = put(conn, Routes.responsibility_path(conn, :update, responsibility), responsibility: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.responsibility_path(conn, :show, id))

      assert %{
               "id" => id,
               "completions" => 43,
               "deadline" => "2011-05-18T15:01:01"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, responsibility: responsibility} do
      conn = put(conn, Routes.responsibility_path(conn, :update, responsibility), responsibility: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete responsibility" do
    setup [:create_responsibility]

    test "deletes chosen responsibility", %{conn: conn, responsibility: responsibility} do
      conn = delete(conn, Routes.responsibility_path(conn, :delete, responsibility))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.responsibility_path(conn, :show, responsibility))
      end
    end
  end

  defp create_responsibility(_) do
    responsibility = fixture(:responsibility)
    %{responsibility: responsibility}
  end
end
