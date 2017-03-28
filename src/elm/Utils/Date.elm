module Utils.Date exposing (dateFormat, timeFormat, friendlyDateFormat)

import Date exposing (Date, Day(..), Month(..), year, month, day, minute, hour, dayOfWeek)

friendlyDateFormat : Date -> String
friendlyDateFormat date =
  let
    d = day date
  in
    (toString d) ++ (daySuffix d) ++ " " ++ (month date |> monthToFullName) ++ " at " ++ (hour date |> leftPadDate) ++ ":" ++ (minute date |> leftPadDate)

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

daySuffix : Int -> String
daySuffix n =
    let
        base =
            rem n 10
    in
        if n < 1 || n > 31 then
            ""
        else if n >= 11 && n <= 13 then
            "th"
        else if base == 1 then
            "st"
        else if base == 2 then
            "nd"
        else if base == 3 then
            "rd"
        else
            "th"

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

monthToFullName m =
    case m of
        Date.Jan ->
            "January"
        Date.Feb ->
            "February"
        Date.Mar ->
            "March"
        Date.Apr ->
            "April"
        Date.May ->
            "May"
        Date.Jun ->
            "June"
        Date.Jul ->
            "July"
        Date.Aug ->
            "August"
        Date.Sep ->
            "September"
        Date.Oct ->
            "October"
        Date.Nov ->
            "November"
        Date.Dec ->
            "December"