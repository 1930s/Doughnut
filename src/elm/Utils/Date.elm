module Utils.Date exposing (dateFormat, timeFormat)

import Date exposing (Date, Day(..), Month(..), year, month, day, dayOfWeek)

dateFormat : Date -> String
dateFormat date =
  leftPadDate (day date) ++ "/" ++ (leftPadDate <| monthToInt <| (month date)) ++ "/" ++ toString (year date)

timeFormat : Int -> String
timeFormat secs =
  let
    hours = (toFloat secs) / 3600 |> floor
    mins = ((toFloat (rem secs 3600)) / 60) |> floor
  in
    if hours < 1 then
      (toString mins) ++ "m"
    else if mins < 1 then
      (toString hours) ++ "h"
    else
      (toString hours) ++ "h " ++ (toString  mins) ++ "m"


leftPadDate : Int -> String
leftPadDate d =
  if d < 10 then
    "0" ++ (toString d)
  else
    toString d

monthToInt : Month -> Int
monthToInt month =
    case month of
        Jan ->
            1
        Feb ->
            2
        Mar ->
            3
        Apr ->
            4
        May ->
            5
        Jun ->
            6
        Jul ->
            7
        Aug ->
            8
        Sep ->
            9
        Oct ->
            10
        Nov ->
            11
        Dec ->
            12