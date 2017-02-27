module Update exposing (init, update, subscriptions)

import Config exposing (Config)
import Model exposing (..)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..), MenuCallback)
import SplitPane.SplitPane as SplitPane exposing (Orientation(..), ViewConfig, createViewConfig, withSplitterAt, withResizeLimits, percentage)
import SplitPane.Bound exposing (createBound)
import Ports exposing (podcastState, podcastsState)
import Decoders exposing (podcastDecoder, podcastsDecoder)
import Json.Decode
import Ipc

init : Config -> (Model, Cmd Msg)
init config =
  let
    model =
    { test = ""
    , podcasts = []
    , selectedPodcast = Nothing
    , selectedEpisode = Nothing
    , splitPane = SplitPane.init Horizontal
      |> withResizeLimits (createBound (percentage 0.25) (percentage 0.6))
      |> withSplitterAt (percentage 0.34)
    , podcastContextMenu = Nothing
    }
  in
    (model, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    ShowPodcastContextMenu menu ->
      { model | podcastContextMenu = Just menu } ! [(ContextMenu.showMenu HandlePodcastContextMenu menu)]

    SelectPodcast pod ->
      { model | selectedPodcast = Just pod } ! []
    
    SelectEpisode ep ->
      { model | selectedEpisode = Just ep } ! []
    
    PlayEpisode ep ->
      { model | selectedEpisode = Just ep } ! [ Ipc.playEpisode ep ]

    HandlePodcastContextMenu r ->
      case model.podcastContextMenu of
        Just menu -> podcastContextMenuUpdate menu r model
        Nothing -> model ! []

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


podcastContextMenuUpdate : (Menu PodcastContextMenu) -> MenuCallback -> Model -> (Model, Cmd Msg)
podcastContextMenuUpdate menu r model =
  case ContextMenu.callback menu r of
    Just (M_ReloadPodcast id) ->
      model ! [Ipc.reloadPodcast id]
    
    Just (M_Unsubscribe id) ->
      model ! [Ipc.unsubscribePodcast id]
    
    _ ->
      model ! []

subscriptions: Model -> Sub Msg
subscriptions model =
  Sub.batch
  [ Sub.map SplitterMsg <| SplitPane.subscriptions model.splitPane
  , podcastState PodcastState
  , podcastsState FullPodcastState
  ]
