module Utils.Text exposing (..)

import Regex exposing (regex)

stripHtml : String -> String
stripHtml input =
  Regex.replace Regex.All (regex "<[^>]*>") (\_ -> "") input