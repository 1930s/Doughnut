module ContextMenu exposing (open, update, MenuItemType(..), MenuItem, Menu, Msg)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Mouse exposing (Position)
import Json.Decode as Decode

type MenuItemType
  = Action
  | Separator

type alias MenuItem msg =
  { itemType : MenuItemType
  , label : String
  , action : msg
  }

type alias Menu msg =
  { name : String
  , items : List (MenuItem msg)
  }

type Msg msg
  = ShowMenu (Menu msg)

update : Msg context -> Cmd Msg
update msg = 
  case msg of
    ShowMenu menu ->
      Cmd.none

open : (Menu msg) -> Attribute (Msg msg)
open menu =
  onWithOptions
    "contextmenu"
    { preventDefault = True, stopPropagation = True }
    ( Decode.succeed (ShowMenu menu)
    )

position : Decode.Decoder Position
position =
  Decode.map2 Position
    (Decode.field "clientX" Decode.int)
    (Decode.field "clientY" Decode.int)