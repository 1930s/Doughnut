module MainWindow.Detail exposing (view)

import Html exposing (..)
import Html.Attributes exposing (..)
import MainWindow.Model exposing (Model, Msg(..), selectedPodcast)
import Types exposing (..)
import Utils.Podcast exposing (imageUrl)
import Utils.Date exposing (dateFormat, timeFormat)
import Markdown
import MainWindow.TaskManager exposing (progressBar)
import MainWindow.PodcastSettings as PodcastSettings

view : Model -> Html Msg
view model =
  div [class "detail"]
  [ case selectedPodcast model of
      Just podcast ->
        if model.showPodcastSettings then
          PodcastSettings.view podcast.podcast
        else
          case model.selectedEpisode of
            Just episode ->
              episodeDetail episode podcast.podcast

            Nothing ->
              podcastDetail model.state podcast

      Nothing ->
        blankView
  ]

episodeDetail : Episode -> Podcast -> Html Msg
episodeDetail episode podcast =
  div [class "episode-detail"]
  [ div [class "episode-info"]
    [ h1 [] [ text episode.title ]
    , h3 [] [ text podcast.title ]
    ]
  , div [class "episode-progress"]
    [ p []
      [ span [] [ text (dateFormat episode.pubDate) ]
      , if episode.duration > 0 then
          span [] [ text (timeFormat episode.duration) ]
        else
          text ""
      ]
    , if (episode.playPosition > 0) && (episode.duration > 1) then
        progressBar episode.playPosition episode.duration
      else
        text ""
    ]
  , Markdown.toHtml [class "episode-description"] episode.description
  ]

podcastDetail : GlobalState -> PodcastWrapped -> Html Msg
podcastDetail globalState pw =
  let
    podcast = pw.podcast
  in
    div [class "podcast-detail"]
    [ div [class "podcast-cover"]
      [ img [src (imageUrl globalState podcast)] []
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
          , td [] [ text (String.join ", " podcast.categories)]
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

blankView : Html Msg
blankView =
  div [ class "detail-blank" ]
  [ img [ src "icon_subtle.png" ] []
  ]