module Update exposing (init, update, subscriptions)

import Types exposing (..)
import Model exposing (..)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..), MenuCallback)
import SplitPane.SplitPane as SplitPane exposing (Orientation(..), ViewConfig, createViewConfig, withSplitterAt, withResizeLimits, percentage)
import SplitPane.Bound exposing (createBound)
import Ports exposing (podcastsUpdated, playerState, errorDialog)
import Decoders exposing (podcastDecoder, podcastsDecoder, playerStateDecoder)
import Json.Decode
import Ipc
import Player
import Http

init : GlobalState -> (Model, Cmd Msg)
init state =
  let
    model =
    { state = state
    , loadCount = 0
    , podcasts = []
    , player = Player.init
    , selectedPodcast = Nothing
    , selectedEpisode = Nothing
    , splitPane = SplitPane.init Horizontal
      |> withResizeLimits (createBound (percentage 0.25) (percentage 0.6))
      |> withSplitterAt (percentage 0.34)
    , podcastContextMenu = Nothing
    , episodeContextMenu = Nothing
    }
  in
    (model, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    ShowPodcastContextMenu menu ->
      { model | podcastContextMenu = Just menu } ! [(ContextMenu.showMenu HandlePodcastContextMenu menu)]

    ShowEpisodeContextMenu menu ->
      { model | episodeContextMenu = Just menu } ! [(ContextMenu.showMenu HandleEpisodeContextMenu menu)]

    SelectPodcast pod ->
      { model | selectedPodcast = Just pod } ! []
    
    SelectEpisode ep ->
      { model | selectedEpisode = Just ep } ! []
    
    PlayEpisode ep ->
      { model | selectedEpisode = Just ep } ! [ Ipc.playEpisode ep.id ]

    HandlePodcastContextMenu r ->
      case model.podcastContextMenu of
        Just menu -> podcastContextMenuUpdate menu r model
        Nothing -> model ! []
    
    HandleEpisodeContextMenu r ->
      case model.episodeContextMenu of
        Just menu -> episodeContextMenuUpdate menu r model
        Nothing -> model ! []

    SplitterMsg paneMsg ->
      { model | splitPane = SplitPane.update paneMsg model.splitPane } ! []
    
    PodcastsUpdated ids ->
      let
        requests = List.map (\id -> reloadPodcast id model) ids
      in
        { model | loadCount = (List.length ids) } ! requests
    
    PodcastLoaded (Ok podcast) ->
      { model | podcasts = [podcast] } ! []

    PodcastLoaded (Err err) ->
      { model | loadCount = (model.loadCount - 1) } ! [errorDialog (toString err)]
    
    PlayerState json ->
      case Json.Decode.decodeValue playerStateDecoder json of
        Ok state ->
          { model | player = state } ! []

        Err error ->
          model ! [errorDialog error]
    
    PlayerMsg subMsg ->
      let
        (state, cmds) = Player.update subMsg model.player
      in
        { model | player = state } ! [Cmd.map PlayerMsg cmds]


podcastContextMenuUpdate : (Menu PodcastContextMenu) -> MenuCallback -> Model -> (Model, Cmd Msg)
podcastContextMenuUpdate menu r model =
  case ContextMenu.callback menu r of
    Just (M_ReloadPodcast id) ->
      model ! [Ipc.reloadPodcast id]
    
    Just (M_Unsubscribe id) ->
      model ! [Ipc.unsubscribePodcast id]
    
    _ ->
      model ! []

episodeContextMenuUpdate : (Menu EpisodeContextMenu) -> MenuCallback -> Model -> (Model, Cmd Msg)
episodeContextMenuUpdate menu r model =
  case ContextMenu.callback menu r of
    Just (M_DownloadEpisode id) ->
      model ! [Ipc.downloadEpisode id]
    
    Just (M_FavouriteEpisode id) ->
      model ! [Ipc.favouriteEpisode id]
    
    _ ->
      model ! []

reloadPodcast : Int -> Model -> Cmd Msg
reloadPodcast id model =
  let
    url = "http://localhost:" ++ (toString model.state.serverPort) ++ "/podcasts/" ++ (toString id)
    request = Http.get url podcastDecoder
  in
    Http.send PodcastLoaded request

subscriptions: Model -> Sub Msg
subscriptions model =
  Sub.batch
  [ Sub.map SplitterMsg <| SplitPane.subscriptions model.splitPane
  , podcastsUpdated PodcastsUpdated
  , playerState Model.PlayerState
  ]
