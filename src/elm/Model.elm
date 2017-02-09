module Model exposing (Model, Msg(..))

import Mouse exposing (Position)
import ContextMenu

type alias Model =
  { test : String
  }

type Msg
  = ContextMenu (ContextMenu.Msg Msg)
  | MenuItemClick
  | NoOp