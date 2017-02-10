module ContextMenu exposing (init, open, update, MenuItemType(..), MenuState, MenuItem, Menu, Msg)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Mouse exposing (Position)
import Json.Decode as Decode
import Logger exposing (debug)
import Task exposing (Task)
import Platform

import Native.ContextMenu

type MenuItemType
  = Action
  | Separator

type alias MenuItem =
  { itemType : MenuItemType
  , label : String
  }

type alias Menu msg =
  { name : String
  , items : List MenuItem
  , toMsg : Msg -> msg
  }

type alias MenuItemHandler =
  { label : String
  }

type Msg
  = ShowMenu (List MenuItemHandler)
  | MenuResult String

type alias MenuState =
  { activeMenu : String
  }

init : MenuState
init =
  MenuState ""

update : Msg -> MenuState -> (MenuState, Cmd Msg)
update msg state = 
  case msg of
    ShowMenu menu ->
      let
        cmd = Task.perform MenuResult (showMenu menu)
      in
        state ! [cmd]
        
    MenuResult str ->
      let
        b = debug str
      in
        state ! [Cmd.none]

open : (Menu msg) -> Attribute msg
open menu =
  let
    itemToHandler i =
      MenuItemHandler i.label

    handlers = List.map itemToHandler menu.items
  in
    onWithOptions
      "contextmenu"
      { preventDefault = True, stopPropagation = True }
      ( Decode.succeed (menu.toMsg (ShowMenu handlers))
      )

showMenu : List MenuItemHandler -> Platform.Task Never String
showMenu items =
  Native.ContextMenu.showMenu items

send : msg -> Cmd msg
send msg =
  Task.succeed msg
  |> Task.perform identity