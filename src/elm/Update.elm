module Update exposing (init, update, subscriptions)

import Config exposing (Config)
import Model exposing (..)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..))
import SplitPane.SplitPane as SplitPane exposing (Orientation(..), ViewConfig, createViewConfig, withSplitterAt, withResizeLimits, percentage)
import SplitPane.Bound exposing (createBound)
import Ports exposing (podcastState, podcastsState)
import Decoders exposing (podcastDecoder, podcastsDecoder)
import Json.Decode

init : Config -> (Model, Cmd Msg)
init config =
  let
    model =
    { test = ""
    , podcasts = []
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
    
    PodcastState json ->
      case Json.Decode.decodeValue podcastDecoder json of
        Ok podcast ->
          { model | test = "parsed" } ! []

        Err error ->
          model ! []
    
    FullPodcastState json ->
      case Json.Decode.decodeValue podcastsDecoder json of
        Ok podcasts ->
          { model | podcasts = podcasts } ! []

        Err error ->
          { model | test = (toString error) } ! []


subscriptions: Model -> Sub Msg
subscriptions model =
  Sub.batch
  [ Sub.map SplitterMsg <| SplitPane.subscriptions model.splitPane
  , podcastState PodcastState
  , podcastsState FullPodcastState
  ]
