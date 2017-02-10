module Update exposing (init, update, view, subscriptions)

import Config exposing (Config)
import Model exposing (Model, Msg(..), ButtonMenuItem(..))
import Logger exposing (debug)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..))

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json

init : Config -> (Model, Cmd Msg)
init config =
  let
    model = Model ""
  in
    (model, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    OpenContextMenu menu ->
      model ! [(ContextMenu.showMenu MenuAction menu)]

    MenuAction r ->
      case ContextMenu.callback buttonMenu r of
        Just (Item1 s) -> { model | test = s } ! []
        Just Item2 -> { model | test = "Item2" } ! []
        Nothing -> { model | test = "" } ! []

    NoOp ->
      model ! []

subscriptions: Model -> Sub Msg
subscriptions model =
  Sub.none

buttonMenu : Menu ButtonMenuItem
buttonMenu =
  let
    items =
    [ ContextMenu.actionItem (Item1 "Test!!_") "Test Item 1"
    , ContextMenu.actionItem (Item1 "_!Test!_") "Different Text for Item 1"
    , ContextMenu.separatorItem
    , ContextMenu.actionItem Item2 "Test Item 2"
    ]
  in
    Menu "Button" items

view : Model -> Html Msg
view model =
  div []
  [ div [class "title-bar"]
    [ div [class "player"]
      [ button [class "play", open (OpenContextMenu buttonMenu)] [ span [class "play-icon"] [] ]
      ]
    , div [class "search"]
      [ text model.test ]
    ]
  ]