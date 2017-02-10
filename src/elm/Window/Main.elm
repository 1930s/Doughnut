module Window.Main exposing (view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Model exposing (..)
import SplitPane.SplitPane as SplitPane exposing (Orientation(..), ViewConfig, createViewConfig, withSplitterAt, withResizeLimits, percentage)
import Podcasts

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
    [ div [class "player"]
      [ button [class "play"] [ span [class "play-icon"] [] ]
      ]
    , div [class "search"]
      [ text model.test ]
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
  [text "Episodes"]