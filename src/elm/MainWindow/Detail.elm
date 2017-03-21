module MainWindow.Detail exposing (view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Model exposing (Model, Msg(..), selectedPodcast)
import Types exposing (..)

view : Model -> Html Msg
view model =
  div [class "detail"]
  [ case selectedPodcast model of
      Just podcast ->
        case model.selectedEpisode of
          Just episode ->
            episodeDetail episode

          Nothing ->
            podcastDetail podcast

      Nothing ->
        blankView
  ]

episodeDetail : Episode -> Html Msg
episodeDetail episode =
  div [] []

podcastDetail : PodcastWrapped -> Html Msg
podcastDetail pw =
  div [] []

blankView : Html Msg
blankView =
  div [ class "detail-blank" ]
  [ img [ src "icon_subtle.png" ] []
  ]