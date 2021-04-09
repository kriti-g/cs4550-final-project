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

  def check_nearby(chore) do
    users = chore.responsibilities
    |> Enum.map(fn rsp -> 
      RoommateApp.Users.get_user!(rsp.user_id)
    end)
    |> Enum.filter(fn usr ->
      usr.location && NaiveDateTime.diff(usr.location.updated_at, NaiveDateTime.utc_now()) < (10 * 60)
    end)
    |> check_nearby_helper
  end

  defp check_nearby_helper([user | users_tail]) do
    uloc = user.location
    to_notify = Enum.filter(users_tail, fn usr ->
      calculate_distance(uloc, usr.location) <= 10
    end)
    if !Enum.empty?(to_notify) do
      [user] ++ to_notify ++ check_nearby_helper(users_tail)
    else
      check_nearby_helper(users_tail)
    end
  end

  defp check_nearby_helper([]), do: []

  # spherical law of cosines
  defp calculate_distance(loc1, loc2) do
    m = :math.pi / 180
    la1 = loc1.latitude * m
    la2 = loc2.latitude * m
    lo = (loc2.longitude - loc1.longitude) * m
    r = 63710
    :math.acos((:math.sin(la1) * :math.sin(la2)) + (:math.cos(la1) * :math.cos(la2) * :math.cos(lo))) * r
  end

end
