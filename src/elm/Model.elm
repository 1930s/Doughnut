module Model exposing (Model, Msg(..))

import Mouse exposing (Position)
import ContextMenu

type alias Model =
  { test : String
  , menuState : Maybe (ContextMenu.MenuState Msg)
  }

type Msg
  = ContextMenu (ContextMenu.Msg Msg)
  | MenuItemClick
  | NoOp