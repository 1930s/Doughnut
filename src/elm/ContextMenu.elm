module ContextMenu exposing (open, MenuItemType(..), MenuItem, Menu, showMenu, callback, actionItem, separatorItem)

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

type alias MenuItem types =
  { itemType : MenuItemType
  , identifier : Maybe types
  , label : String
  }

type alias Menu types =
  { name : String
  , items : List (MenuItem types)
  }

actionItem : types -> String -> MenuItem types
actionItem t label =
  MenuItem Action (Just t) label

separatorItem : MenuItem types
separatorItem =
  MenuItem Separator Nothing ""

open : msg -> Attribute msg
open m =
  onWithOptions
    "contextmenu"
    { preventDefault = True, stopPropagation = True }
    ( Decode.succeed m
    )

showNativeMenu : List (MenuItem types) -> Platform.Task Never String
showNativeMenu items =
  Native.ContextMenu.showMenu items

showMenu : (String -> msg) -> Menu types -> Cmd msg
showMenu callback menu =
  Task.perform callback (showNativeMenu menu.items)

callback : (Menu types) -> String -> Maybe types
callback menu label =
  case List.filter (\item -> item.label == label) menu.items
  |> List.head of
    Just item -> item.identifier
    Nothing -> Nothing
