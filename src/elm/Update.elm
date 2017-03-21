module Update exposing (init, update, subscriptions)

import Types exposing (..)
import Model exposing (..)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..), MenuCallback)
import SplitPane.SplitPane as SplitPane exposing (Orientation(..), ViewConfig, createViewConfig, withSplitterAt, withResizeLimits, percentage)
import SplitPane.Bound exposing (createBound)
import Ports exposing (podcastLoading, podcastUpdated, episodeUpdated, playerState, errorDialog, taskState)
import Decoders exposing (podcastLoadingDecoder, podcastDecoder, podcastListDecoder, playerStateDecoder, episodeDecoder, episodeListDecoder, podcastsStateDecoder, taskStateDecoder)
import Json.Decode
import Ipc
import Player
import Http

init : GlobalState -> (Model, Cmd Msg)
init state =
  let
    model =
    { state = state
    , podcasts = []
    , player = Player.init
    , tasks = Types.TaskState False []
    , selectedEpisode = Nothing
    , splitPane = SplitPane.init Horizontal
      |> withResizeLimits (createBound (percentage 0.25) (percentage 0.6))
      |> withSplitterAt (percentage 0.34)
    , podcastContextMenu = Nothing
    , episodeContextMenu = Nothing
    }
  in
    (model, Cmd.batch
    [ loadAllPodcasts
    , Ports.loaded True
    ])

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    -- Init Load
    PodcastsLoaded (Ok podcasts) ->
      { model | podcasts = podcasts } ! []
    
    PodcastsLoaded (Err err) ->
      { model | podcasts = [] } ! [errorDialog (toString err)]
    
    EpisodesLoaded (Ok episodes) ->
      let
        podcast = case List.head episodes of
          Just ep -> 
            List.filter (\p -> p.podcast.id == ep.podcastId) model.podcasts |> List.head
          Nothing -> Nothing
        
        podcast_id = case podcast of
          Just p -> p.podcast.id
          Nothing -> 0

        updateEpisodes pw =
          if pw.podcast.id == podcast_id then { pw | episodes = episodes } else pw
      in
        { model | podcasts = List.map updateEpisodes model.podcasts } ! []
      
    EpisodesLoaded (Err err) ->
      model ! [errorDialog (toString err)]
    
    -- IPC -> Elm
    PodcastLoading json ->
      case Json.Decode.decodeValue podcastLoadingDecoder json of
        Ok loading ->
          let
            setLoading pw =
              if pw.podcast.id == loading.id then { pw | loading = loading.loading } else pw
          in
            { model | podcasts = List.map setLoading model.podcasts } ! []
        
        Err err ->
          model ! [errorDialog (toString err)]

    PodcastUpdated json ->
      case Json.Decode.decodeValue podcastDecoder json of
        Ok podcast ->
          let
            existing = List.filter (\pw -> pw.podcast.id == podcast.id) model.podcasts
              |> List.head

            updatePodcast pw = 
              if pw.podcast.id == podcast.id then { pw | podcast = podcast } else pw
            
            state = case existing of
              Just found ->
                { model | podcasts = List.map updatePodcast model.podcasts }
              Nothing ->
                { model | podcasts = model.podcasts ++ [PodcastWrapped podcast [] False False] }
          in
            state ! [loadEpisodes podcast.id]

        Err err ->
          model ! [errorDialog (toString err)]

    EpisodeUpdated json ->
      case Json.Decode.decodeValue episodeDecoder json of
        Ok episode ->
          let
            updateEpisode e =
              if e.id == episode.id then episode else e

            updatePodcastEpisode pw =
              if not (List.filter (\e -> e.id == episode.id) pw.episodes |> List.isEmpty) then
                { pw | episodes = List.map updateEpisode pw.episodes }
              else
                pw
          in
            { model | podcasts = List.map updatePodcastEpisode model.podcasts } ! []

        Err err ->
          model ! [errorDialog (toString err)]

    -- Context Menus

    ShowPodcastContextMenu menu ->
      { model | podcastContextMenu = Just menu } ! [(ContextMenu.showMenu HandlePodcastContextMenu menu)]

    ShowEpisodeContextMenu menu ->
      { model | episodeContextMenu = Just menu } ! [(ContextMenu.showMenu HandleEpisodeContextMenu menu)]
    
    -- Selections

    SelectPodcast pod ->
      let
        selectPodcast pw =
          if pw.podcast.id == pod.podcast.id then
            { pw | selected = True }
          else
            { pw | selected = False }
      in
        { model | podcasts = List.map selectPodcast model.podcasts } ! []
    
    SelectEpisode ep ->
      case model.selectedEpisode of
        Just selected ->
          if (selected.id == ep.id) then
            { model | selectedEpisode = Nothing } ! []
          else
            { model | selectedEpisode = Just ep } ! []

        Nothing ->
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
    
    TaskState json ->
      case Json.Decode.decodeValue taskStateDecoder json of
        Ok state ->
          { model | tasks = state } ! []
        
        Err error ->
          model ! [errorDialog error]

    PlayerState json ->
      case Json.Decode.decodeValue playerStateDecoder json of
        Ok state ->
          let
            { player } = model
            playerModel = { player | state = state }
          in
            { model | player = playerModel } ! []

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
    Just (M_PlayEpisode id) ->
      model ! [Ipc.playEpisode id]

    Just (M_MarkPlayed id) ->
      model ! [Ipc.markPlayedEpisode id]

    Just (M_MarkUnplayed id) ->
      model ! [Ipc.markUnplayedEpisode id]

    Just (M_MarkFavourite id) ->
      model ! [Ipc.favouriteEpisode id]

    Just (M_UnmarkFavourite id) ->
      model ! [Ipc.unFavouriteEpisode id]

    Just (M_DownloadEpisode id) ->
      model ! [Ipc.downloadEpisode id]
          
    Just (M_ShowFinder id) -> 
      model ! [Ipc.revealEpisode id]
    
    Just (M_MarkAllPlayed podcastId) ->
      model ! [Ipc.markAllPlayedPodcast podcastId]
    
    Just (M_MarkAllUnplayed podcastId) ->
      model ! [Ipc.markAllUnplayedPodcast podcastId]

    _ ->
      model ! []

loadAllPodcasts : Cmd Msg
loadAllPodcasts =
  let
    url = "http://localhost:" ++ (toString serverPort) ++ "/podcasts"
    request = Http.get url podcastsStateDecoder
  in
    Http.send PodcastsLoaded request

loadEpisodes : Int -> Cmd Msg
loadEpisodes id =
  let
    url = "http://localhost:" ++ (toString serverPort) ++ "/podcasts/" ++ (toString id) ++ "/episodes"
    request = Http.get url episodeListDecoder
  in
    Http.send EpisodesLoaded request

subscriptions: Model -> Sub Msg
subscriptions model =
  Sub.batch
  [ Sub.map SplitterMsg <| SplitPane.subscriptions model.splitPane
  , podcastLoading PodcastLoading
  , podcastUpdated PodcastUpdated
  , episodeUpdated EpisodeUpdated
  , playerState Model.PlayerState
  , taskState Model.TaskState
  ]
