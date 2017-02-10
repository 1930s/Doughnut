module Update exposing (init, update, view, subscriptions)

import Config exposing (Config)
import Model exposing (Model, Msg(..))
import Logger exposing (debug)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..))

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json

init : Config -> (Model, Cmd Msg)
init config =
  let
    model =
      { test = ""
      , menuState = ContextMenu.init
      }
  in
    (model, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    ContextMenu subMsg ->
      let
        (state, cmds) = ContextMenu.update subMsg model.menuState
      in
        { model | menuState = state } ! [cmds |> Cmd.map ContextMenu]

    MenuItemClick ->
      let
        a = debug "Right Click!!!"
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
      MenuItem Action "Test Item"
    ]
  in
    Menu "Button" items ContextMenu

view : Model -> Html Msg
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