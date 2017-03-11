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
    , div [class "search"]
      []
    ]
  , main_ []
    [ SplitPane.view splitterConfig (podcastsView model) (episodesView model) model.splitPane
    ]
  ]

podcastsView : Model -> Html Msg
podcastsView model =
  div [class "podcasts"]
  [ Podcasts.list model
  ]

episodesView : Model -> Html Msg
episodesView model =
  div [class "episodes"]
  [ case model.selectedPodcast of
      Just selected ->
        podcastView selected model
      
      Nothing ->
        p [] [text "Please select a podcast"]
  ]

podcastView : Podcast -> Model -> Html Msg
podcastView podcast model =
  div []
  [ div [class "podcast-detail"]
    [ div [class "podcast-cover"]
      [ img [src "http://placehold.it/150x150"] []
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
  , Episodes.list model podcast
  ]