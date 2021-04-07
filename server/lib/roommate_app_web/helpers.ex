defmodule RoommateAppWeb.Helpers do

  def is_group_member(user, params) do
    group_id = params["group_id"]
    user.group_id == group_id
  end

  def get_next_in_rotation(order, prev_user_id) do
    fun = fn(el) -> el == prev_user_id end
    last_ind = Enum.find_index(order, fun)
    if last_ind + 1 == Enum.count(order) do
      hd order
    else
      Enum.at(order, last_ind + 1)
    end
  end

end
