module ContextMenu exposing (open, update, MenuItemType(..), MenuItem, Menu, Msg)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Mouse exposing (Position)
import Json.Decode as Decode
import Logger exposing (debug)
import Task exposing (Task)

import Native.ContextMenu

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
  , toMsg : Msg msg -> msg
  }

type alias MenuItemHandler msg =
  { label : String
  , action : Decode.Decoder msg
  }

type Msg msg
  = ShowMenu (List (MenuItemHandler msg))
  | MenuResultFail String
  | MenuResult String

update : Msg context -> Cmd Msg
update msg = 
  case msg of
    ShowMenu menu ->
      let
        cmd = Task.perform MenuResultFail MenuResultFail (showMenu menu)
      in
        cmd
    
    MenuResultFail str ->
      Cmd.none

    MenuResult str ->
      let
        b = debug str
      in
        Cmd.none

open : (Menu msg) -> Attribute msg
open menu =
  let
    itemToHandler i =
      MenuItemHandler i.label (Decode.succeed i.action)

    handlers = List.map itemToHandler menu.items
  in
    onWithOptions
      "contextmenu"
      { preventDefault = True, stopPropagation = True }
      ( Decode.succeed (menu.toMsg (ShowMenu handlers))
      )

position : Decode.Decoder Position
position =
  Decode.map2 Position
    (Decode.field "clientX" Decode.int)
    (Decode.field "clientY" Decode.int)

showMenu : List (MenuItemHandler msg) -> Task String String
showMenu = Native.ContextMenu.showMenu