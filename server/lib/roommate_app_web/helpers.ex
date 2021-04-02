defmodule RoommateAppWeb.Helpers do

  def is_group_member(user, params) do
    group_id = params["group_id"]
    user.group_id == group_id
  end

end
