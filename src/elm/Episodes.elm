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
    [ ContextMenu.actionItem (M_PlayEpisode episode.id) "Play Now"
    , ContextMenu.separatorItem
    , if not episode.played then
        ContextMenu.actionItem (M_MarkPlayed episode.id) "Mark as Played"
      else
        ContextMenu.disabledItem (M_MarkPlayed episode.id) "Mark as Played"
    , if episode.played then
        ContextMenu.actionItem (M_MarkUnplayed episode.id) "Mark as Unplayed"
      else
        ContextMenu.disabledItem (M_MarkUnplayed episode.id) "Mark as Unplayed"
    , if not episode.favourite then
        ContextMenu.actionItem (M_MarkFavourite episode.id) "Mark as Favourite"
      else
        ContextMenu.disabledItem (M_MarkFavourite episode.id) "Mark as Favourite"
    , if episode.favourite then
        ContextMenu.actionItem (M_UnmarkFavourite episode.id) "Unmark Favourite"
      else
        ContextMenu.disabledItem (M_UnmarkFavourite episode.id) "Unmark Favourite"
    , ContextMenu.separatorItem
    , if not episode.downloaded then
        ContextMenu.actionItem (M_DownloadEpisode episode.id) "Download"
      else
        ContextMenu.disabledItem (M_DownloadEpisode episode.id) "Download"
    , if episode.downloaded then
        ContextMenu.actionItem (M_ShowFinder episode.id) "Show in Finder"
      else
        ContextMenu.disabledItem (M_ShowFinder episode.id) "Show in Finder"
    , ContextMenu.separatorItem
    , ContextMenu.actionItem (M_MarkAllPlayed episode.podcastId) "Mark all as Played"
    , ContextMenu.actionItem (M_MarkAllUnplayed episode.podcastId) "Mark all as Unplayed"
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
      , ("episode--unplayed", not ep.played)
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
    , if not ep.played then 
        unplayedBar ep.playPosition ep.duration
      else
        text ""
    , h2 [] [ text ep.title ]
    , p [class "episode-summary"] [ text ep.description ]
    , p []
      [ text (dateFormat ep.pubDate)
      ]
    ]

unplayedBar : Int -> Int -> Html Msg
unplayedBar played total =
  let
    percent = if total > 0 then
        ((toFloat played) / (toFloat total)) * 100
      else
        0
    
    barWidthPercent = (100 - percent) |> toString
  in
    div [class "unplayed-bar", style [("width", barWidthPercent ++ "%")]]
    []