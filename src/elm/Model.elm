module Model exposing (Model, Msg(..))

import Mouse exposing (Position)
import ContextMenu

type alias Model =
  { test : String
  , menuState : ContextMenu.MenuState
  }

type Msg
  = ContextMenu ContextMenu.Msg
  | MenuItemClick
  | NoOp