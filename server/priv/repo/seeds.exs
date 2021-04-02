# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     RoommateApp.Repo.insert!(%RoommateApp.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias RoommateApp.Repo
alias RoommateApp.Users.User
alias RoommateApp.Groups.Group
alias RoommateApp.Chores.Chore
alias RoommateApp.Responsibilities.Responsibility

defmodule Inject do
  def user(name, pass, email, group_id) do
    hash = Argon2.hash_pwd_salt(pass)
    Repo.insert!(%User{name: name, email: email, password_hash: hash, group_id: group_id})
  end
end

alicenbob = Repo.insert!(%Group{name:"Home in Boston", address:"333 Huntington, Boston MA", rotation_order:"[1,2]"})

alice = Inject.user("Alice", "password1", "alice@email.com", alicenbob.id)
bob = Inject.user("Bob", "passwordd2", "bob@email.com", alicenbob.id)

c1 = %Chore{
  name: "Washing dishes",
  desc: "Wash all the dishes in the kitchen sink and wipe around it afterwards.",
  rotation: 2,
  frequency: 24,
  group_id: alicenbob.id
}

chore1 = Repo.insert!(c1)

r1 = %Responsibility{
  completions: 1,
  deadline: ~N[2022-01-19 23:00:00],
  user_id: alice.id,
  chore_id: chore1.id
}

Repo.insert!(r1)
