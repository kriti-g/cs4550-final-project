defmodule RoommateAppWeb.PageController do
  use RoommateAppWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
