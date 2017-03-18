module Episodes exposing (list)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Model exposing (Model, Msg(..), EpisodeContextMenu(..))
import Types exposing (..)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..))
import Utils.Date exposing (dateFormat)
import Icons

list : Model -> PodcastWrapped -> Html Msg
list model pw =
  ul []
    (List.map (viewEpisode model) pw.episodes)

episodeContextMenu : Episode -> Menu EpisodeContextMenu
episodeContextMenu episode =
  let
    items =
    [ ContextMenu.actionItem (M_DownloadEpisode episode.id) "Download"
    , ContextMenu.actionItem (M_FavouriteEpisode episode.id) "Favourite"
    , ContextMenu.separatorItem
    ]
  in
    Menu "Episode" items

viewEpisode : Model -> Episode -> Html Msg
viewEpisode model ep =
  let
    selected = case model.selectedEpisode of
      Just s -> s.id == ep.id
      Nothing -> False
    
    new = if (ep.played == False) && (ep.playPosition == 0) then
        True
      else
        False

    contextMenu = episodeContextMenu ep
  in
    li [ classList
      [ ("episode", True)
      , ("episode--favourite", ep.favourite)
      , ("episode--played", ep.played)
      , ("episode--new", new)
      , ("episode--selected", selected)
      ]
    , open (ShowEpisodeContextMenu contextMenu)
    , onClick (SelectEpisode ep)
    , onDoubleClick (PlayEpisode ep)
    ]
    [ if ep.favourite then
        div [ class "bookmark" ] [ Icons.bookmarkIcon ]
      else
        text ""
    , if ep.downloaded then
        div [ class "downloaded" ] [ Icons.downloadedIcon ]
      else
        text ""
    , h2 []
      [ if not ep.played then 
          Icons.playPosition ep.playPosition
        else
          text ""
      , text ep.title ]
    , p [] [ text ep.description ]
    , p []
      [ text (dateFormat ep.pubDate)
      ]
    ]
