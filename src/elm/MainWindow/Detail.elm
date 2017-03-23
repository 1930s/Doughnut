module MainWindow.Detail exposing (view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Model exposing (Model, Msg(..), selectedPodcast)
import Types exposing (..)
import Utils.Podcast exposing (imageUrl)
import Markdown

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
  div [class "episode-detail"]
  [ Markdown.toHtml [class "episode-description"] episode.description
  ]

podcastDetail : PodcastWrapped -> Html Msg
podcastDetail pw =
  let
    podcast = pw.podcast
  in
    div [class "podcast-detail"]
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

blankView : Html Msg
blankView =
  div [ class "detail-blank" ]
  [ img [ src "icon_subtle.png" ] []
  ]