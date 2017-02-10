module Update exposing (init, update, subscriptions)

import Config exposing (Config)
import Model exposing (..)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..))
import SplitPane.SplitPane as SplitPane exposing (Orientation(..), ViewConfig, createViewConfig, withSplitterAt, withResizeLimits, percentage)
import SplitPane.Bound exposing (createBound)

init : Config -> (Model, Cmd Msg)
init config =
  let
    model =
    { test = ""
    , splitPane = SplitPane.init Horizontal
      |> withResizeLimits (createBound (percentage 0.25) (percentage 0.75))
      |> withSplitterAt (percentage 0.32)
    }
  in
    (model, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    ShowPodcastContextMenu menu ->
      model ! [(ContextMenu.showMenu HandlePodcastContextMenu menu)]

    HandlePodcastContextMenu r ->
      model ! []
    --  case ContextMenu.callback buttonMenu r of
    --    Just (Item1 s) -> { model | test = s } ! []
    --    Just Item2 -> { model | test = "Item2" } ! []
    --    Nothing -> { model | test = "" } ! []

    SplitterMsg paneMsg ->
      { model | splitPane = SplitPane.update paneMsg model.splitPane } ! []

subscriptions: Model -> Sub Msg
subscriptions model =
  Sub.batch
  [ Sub.map SplitterMsg <| SplitPane.subscriptions model.splitPane
  ]
