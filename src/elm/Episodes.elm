module Episodes exposing (list)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Model exposing (Model, Msg(..), PodcastContextMenu(..))
import Types exposing (..)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..))
import Utils.Date exposing (dateFormat)

list : Model -> Podcast -> Html Msg
list model podcast =
  ul []
    (List.map (viewEpisode model) podcast.episodes)

viewEpisode : Model -> Episode -> Html Msg
viewEpisode model ep =
  let
    selected = case model.selectedEpisode of
      Just s -> s.id == ep.id
      Nothing -> False

    unplayed = ep.id == 2
    favourite = ep.id == 10
  in
    li [ classList
      [ ("episode", True)
      , ("episode--favourite", favourite)
      , ("episode--unplayed", unplayed)
      , ("episode--selected", selected)
      ]
    , onClick (SelectEpisode ep)
    , onDoubleClick (PlayEpisode ep)
    ]
    [ h2 [] [ text ep.title ]
    , p [] [ text ep.description ]
    , p []
      [ text (dateFormat ep.pubDate)
      ]
    ]
