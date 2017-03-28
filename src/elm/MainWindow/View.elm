module MainWindow.View exposing (view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Types exposing (..)
import MainWindow.Model exposing (..)
import MainWindow.Podcasts as Podcasts
import MainWindow.Episodes as Episodes
import MainWindow.Player as Player
import Utils.Podcast exposing (imageUrl)
import MainWindow.TaskManager as TaskManager
import Icons
import MainWindow.Detail as Detail

view : Model -> Html Msg
view model =
  div [class "main-window"]
  [ div [class "title-bar"]
    [ Html.map PlayerMsg (Player.view model.state model.player)
    , div [class "misc-controls"]
      [ Html.map PlayerMsg (Player.volumeControl model.player)
      ]
    ]
  , main_ [class "podcasts-split"]
    [ --SplitPane.view splitterConfig (podcastsView model) (episodesView model) model.splitPane
      podcastsView model
    , div [id "gutter-1", class "gutter gutter-horizontal"] []
    , episodesView model
    , div [id "gutter-2", class "gutter gutter-horizontal"] []
    , Detail.view model
    ]
  ]

podcastsView : Model -> Html Msg
podcastsView model =
  div [class "podcasts"]
  [ Podcasts.list model
  , TaskManager.view model
  , libraryControlView model
  ]

libraryControlView : Model -> Html Msg
libraryControlView model =
  div [class "library-controls"]
  [ button [class "library-settings", onClick ToggleShowPodcastSettings]
    [ Icons.cogIcon
    ]
  , if model.tasks.processing then
      div [class "library-processing"]
      [ Icons.spinner
      ]
    else
      text ""
  , button [class "library-subscribe", onClick PodcastSubscribe]
    [ Icons.plusIcon
    ]
  ]

episodesView : Model -> Html Msg
episodesView model =
  div [class "episodes"]
  [ case selectedPodcast model of
      Just selected ->
        Episodes.list model selected
      
      Nothing ->
        p [] [text "Select a odcast"]
  ]

detailView : Model -> Html Msg
detailView model =
  div [class "detail"] [text "detail"]