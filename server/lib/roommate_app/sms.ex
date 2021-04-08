defmodule RoommateApp.Sms do
  def sendSMS(%{"phone" => phone_number, "msg" => msg}) do
    IO.inspect([:sendSMS_phonenumber, phone_number])

    # https://www.twilio.com/docs/sms/api/message-resource#create-a-message-resource
    # specific formatting: https://github.com/edgurgel/httpoison/issues/109
    url =
      "https://api.twilio.com/2010-04-01/Accounts/AC1259ba576ff64b91a9c69fe487f7493e/Messages.json"

    to_number = phone_number
    messagingServiceSid = "MG7e76a0fbe7dd06db319d212769aa01ec"
    body = msg

    # redacted.
    encodedToken = "Basic " <> Base.encode64("AC1259ba576ff64b91a9c69fe487f7493e:cb34bc53d51fb97a3d1972ad0356cb71")

    b =
      HTTPoison.post(
        url,
        {:form, [To: to_number, MessagingServiceSid: messagingServiceSid, Body: body]},
        %{Authorization: encodedToken}
      )

    IO.inspect([:sendSMS_postresponse, b])
  end

  # type is of : "[Update]" ,  "[New]"
  def sendSMS!(%{"type" => type, "phone" => phone_number, "deadline" => deadline, "chore" => chore}) do

    IO.inspect([:sendSMS!, deadline])
    # date = deadline.day <> "/" <> deadline.month <> "/" <> deadline.year
    msg = type <> " Chore: " <> chore.name <> " is due " <> deadline
    sendSMS(%{"phone" => phone_number, "msg" => msg})
  end
end
