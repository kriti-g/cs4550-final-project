defmodule RoommateApp.Token do
  use Joken.Config

  # Override default config
  @impl true
  def token_config do
    default_claims(skip: [:exp])
  end
end
