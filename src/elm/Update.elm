module Update exposing (init, update, view, subscriptions)

import Config exposing (Config)
import Model exposing (Model, Msg(..))
import Logger exposing (debug)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..))

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

init : Config -> (Model, Cmd Msg)
init config =
  let
    model =
      { test = ""
      }
  in
    (model, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    ContextMenu msg ->
      let
        cmds = ContextMenu.update msg
      in
        model ! []

    MenuItemClick ->
      let
        a = debug "Right Click"
      in
        model ! []

    NoOp ->
      model ! []

subscriptions: Model -> Sub Msg
subscriptions model =
  Sub.none

buttonMenu : Menu Msg
buttonMenu =
  let
    items = [
      MenuItem Action "Test Item" MenuItemClick
    ]
  in
    Menu "Button" items

view : Model -> Html (ContextMenu.Msg Msg)
view model =
  div []
  [ div [class "title-bar"]
    [ div [class "player"]
      [ button [class "play", open (buttonMenu)] [ span [class "play-icon"] [] ]
      ]
    , div [class "search"]
      [ text "Hi" ]
    ]
  ]