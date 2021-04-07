defmodule RoommateAppWeb.Plugs.RequireLoggedIn do
  import Plug.Conn

  def init(args), do: args

  def call(conn, _args) do
    token = Enum.at(get_req_header(conn, "session-token"), 0)
    case RoommateApp.Token.verify_and_validate(token) do
      {:ok, jwt_claims} ->
        user_id = jwt_claims["user_id"]
        user = RoommateApp.Users.get_user!(user_id) # find the assoc user
        assign(conn, :user, user) # assign the user to conn for easy access
      {:error, _err} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unauthorized, Jason.encode!(%{"error" => "Not signed in."}))
        |> halt()
    end
  end
end
