module Model exposing (Model, Msg(..), ButtonMenuItem(..))

import Mouse exposing (Position)
import ContextMenu exposing (Menu)

type alias Model =
  { test : String
  }

type ButtonMenuItem
  = Item1 String
  | Item2

type Msg
  = OpenContextMenu (Menu ButtonMenuItem)
  | MenuAction String
  | NoOp