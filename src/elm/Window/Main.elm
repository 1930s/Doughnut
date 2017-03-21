module Window.Main exposing (view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Types exposing (..)
import Model exposing (..)
import SplitPane.SplitPane as SplitPane exposing (Orientation(..), ViewConfig, createViewConfig, withSplitterAt, withResizeLimits, percentage)
import Podcasts
import Episodes
import Player
import Utils.Podcast exposing (imageUrl)
import TaskManager
import Icons
import MainWindow.Detail

splitterConfig : ViewConfig Msg
splitterConfig =
  createViewConfig
    { toMsg = SplitterMsg
    , customSplitter = Nothing
    }

view : Model -> Html Msg
view model =
  div [class "main-window"]
  [ div [class "title-bar"]
    [ Html.map PlayerMsg (Player.view model.player)
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
    , MainWindow.Detail.view model
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
  [ button [class "library-settings"]
    [ Icons.cogIcon
    ]
  , if model.tasks.processing then
      div [class "library-processing"]
      [ Icons.spinner
      ]
    else
      text ""
  , button [class "library-subscribe"]
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
        p [] [text "Please select a podcast"]
  ]

podcastView : PodcastWrapped -> Model -> Html Msg
podcastView pw model =
  let
    podcast = pw.podcast
  in
    div []
    [ div [class "podcast-detail"]
      [ div [class "podcast-cover"]
        [ img [src (imageUrl podcast)] []
        ]
      , div [class "podcast-info"]
        [ h1 [] [ text podcast.title ]
        , p [] [ text podcast.description ]
        , table []
          [ tr []
            [ td [] [ text "Last Update" ]
            , td [] [ text "27th February at 02:02"]
            ]
          , tr []
            [ td [] [ text "Categories" ]
            , td [] [ text "Comedy, TV & Film"]
            ]
          , tr []
            [ td [] [ text "Owner" ]
            , td [] [ text podcast.copyright]
            ]
          , tr []
            [ td [] [ text "Website" ]
            , td [] [ a [ href podcast.link ] [ text podcast.link ]]
            ]
          ]
        ]
      ]
    , Episodes.list model pw
    ]
  
detailView : Model -> Html Msg
detailView model =
  div [class "detail"] [text "detail"]