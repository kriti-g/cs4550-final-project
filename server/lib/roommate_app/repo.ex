defmodule RoommateApp.Repo do
  use Ecto.Repo,
    otp_app: :roommate_app,
    adapter: Ecto.Adapters.Postgres
end
