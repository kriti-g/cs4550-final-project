# Final Report

Our team for the final project is composed of Seokju Yun, Kriti Gurubacharya,
Neil Resnik, and Benjamin Wakefield. The app is fully deployed and functional at
https://roommate.gkriti.art, with the full code available at
https://github.com/kriti-g/cs4550-final-project.

Each group member was able to efficiently tackle different tasks through use of
Github issues. Seokju worked on setting up the JS Redux store and API helpers,
the Twilio SMS API functionality and integration, chore creation and chore
assignment. Kriti handled the initial database schema creation, access control
plugs, group and invite functionality, responsibility updates, Elixir channel
integration. Neil set up the initial skeleton of the SPA React app including
user registration and login (session handling), and form and show pages. He also
worked on JWT integration and the location feature. Benjamin did a bulk of work
on the location feature, and also handled all the presentation editing.

#### App Usage

Our app allows a group of people to coordinate chores. Specifically, once one
has made an account, it allows them to form a group and invite others to join
their group. This invite shows up in their group tab, and they can easily accept
and see the whole group. Once in a group, you can create various chores, and
specify who in the group is responsible for completing these chores. These
chores rotate through the people responsible for them as they are completed, in
a round robin format. Furthermore, you can set it up to get text reminders for a
chore, so you won’t forget while on the go. You can also check in and share your
location, and if any of your groupmates have also checked in recently and are
within 10 meters, the app will notify you that they are nearby for that chore.
You can set a due date and time for a chore, and you can set a frequency with
which the chore repeats, as well as how many times the chore must be completed
before it rotates to the next responsible user. You can freely add and remove
users responsible for a specific chore as well. Of course, one can easily remove
chores, or leave a group if they so wish as well.

A user interacts with the application as described above, for the purpose of
effectively streamlining their chores. As an example workflow is detailed below,
and further workflows breaking down each detail of the app are available in the
[project proposal.](https://github.com/kriti-g/CS4550FinalProposal/blob/main/README.md)
- Carol creates a new chore Grocery Shopping, and assigns Alice and Bob to it.
- Alice receives a text telling her that she's been assigned to Grocery
Shopping, to be completed by tomorrow morning.
- Alice stops by the supermarket on her way home. When she is there, she
briefly takes a moment to check-in to the chore to let the group channel know
where she is and that she's ready to do it.
- Right as she's about to go in, she sees a notification at the top of the page
which tells her that Bob is nearby and ready for Grocery Shopping.  
- She sees Bob is at the supermarket, and they complete their chore together.
- Bob marks the chore complete. The chore is reassigned to Bob and Carol.
- Carol receives the message informing her of the reassignment, so she knows
that she has to go grocery shopping next.

#### Features, Requirements, Testing

Our project is an SPA created with React and Phoenix, where the front-end app
communicates with the server via JSON API (authenticated with JWT) and Elixir
channels. It utilises user accounts with secure password authentication. The
server communicates with the external Twilio SMS API. A logged in user in a
group connects to a group channel which pushes any updates the members make to
the rest of the group in real-time.

The app uses the HTML5 location API to get a user’s location (if the user wishes
to share it), and then it uses the spherical law of cosines to calculate the
distance between all users who have recently checked in for the chore (checked
in within the last 10 minutes). If any of them are within 10 meters of each
other, all those users receive a real time notification that others are nearby
for that specific chore. This communication happens with the server using
Phoenix channels over a WebSocket, allowing it to happen in real time, and
ensuring all logged in and connected users will receive the notification in real
time. Furthermore, to facilitate this location access, our site uses SSL,
forcing both HTTPS and WSS, as most browsers disable sharing location over
insecure communication methods. This also helps protect a user’s password when
it is transmitted to the server for validation.

We effectively tested our app by starting a group call and going through every
different function in our app and reporting the results to each other. This
included confirming that texts were being received, that everyone could see the
same thing in real-time, etc. Seeing as none of us were able to meet in person,
however, the location aspect was tested by one person logged into two different
accounts.

#### Developments after Initial Proposal

The project has stayed consistent with the proposal for the most part, with only
a few minor changes. For example, where the proposal initially said that upon a
group member leaving all their chores should be reassigned to the next person in
the rotation, upon testing this experience we decided that a person suddenly
having enough chores for two people didn't seem like the kind of feature a user
would want. Ultimately, we decided that their assignments should simply be
removed, and their chores' reassignment and redistribution should be up to the
remaining members to decide manually.

#### Notable Challenges

One of the most complex parts of the app is managing the “responsibilities” and
“chore” object workflow. The end result is that we wanted users to be able to
create their custom chores while being mindful of the different lifestyles. This
meaning some users would want their chores to rotate to the next user in line
every day, every week, or every 64th day. And we knew some chores may need to be
completed multiple times by the same user or group of users.  To preserve this
level of granular customization to make our app appealing to the end-users, we
split up the data models into “chore” and “responsibilities”. Chores keep track
of what the actual task is, and how often it should be completed, and how many
times it should be completed. Responsibilities object keeps track of the number
of completions, deadline, and what user is responsible for a particular chore.

The confusing part here is that one can assign multiple users to the same chore.
The UI displays a chore, the deadline, and the set of users of the group. The
ones already assigned (aka holds a responsibility object of this chore) will be
marked as selected. Any user can freely select the deadline and unselect/select
the users. By sending the server a list of user_ids, the server will be able to
easily delete/create/update any new responsibility object using a reducer
function. If at any moment there was a failure, the errors are stored in the
accumulator which can return the proper errors to the user.

Updating a responsibility (i.e. marking a completion) happened in a similar
fashion, with a different difficulty. A user marking a completion would not only
update their responsibility, but would find all the related responsibilities to
the chore and update them accordingly. When it came time to rotate, this meant
that for each user assigned to the chore, the server would find the user
directly after them in the rotation order and reassign the responsibility to
them. For example, if A, B and C were assigned to a chore, and the rotation
order was ```[A, B, C, D]```, the reassignment would be to B, C, and D.

Another challenging stage of development was troubleshooting the location
proximity feature. Although designing the front-end was relatively simple, we
ran into issues while linking it with the back-end server logic. Initially we
were going to store a user's most recent location as a string in the database,
but it proved to be more useful to have a separate table for locations that are
linked to users. This allowed us to access the latitude and longitude, as well
as when the location was last updated. Additionally, we were getting errors when
using the decimal type for the latitude and longitude, but switching these
values to floats solved the issue. Lastly, we realized that the channel used for
location was not being closed on logout, which was causing the location to not
be updated for a user when they access the check in feature.

A trivial but difficult problem was reverse-engineering the POST curl command
into an Elixir httpoison format. Since the Twilio SMS API didn’t support Elixir
natively, I had to use the curl command instead. The problem was the headers of
the curl command didn’t match up at all with the proper format of httpoison
format. For example, the authorization part in the curl command had
```-u [AccountSid]:[AuthToken]```. But the httpoison format had to be put like:
```%{Authorization: Basic encoded64_accoundsid:authtoken)}```. None of these
parts were available anywhere in the docs including how the ```-u``` changed
into ```Authorization``` or that the token string now had to be encoded in
base64 even though it didn’t need to be using ```curl```.
