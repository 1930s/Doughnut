module Podcasts exposing (list)

import Html exposing (..)
import Html.Attributes exposing (..)
import Model exposing (Model, Msg(..), PodcastContextMenu(..))
import Types exposing (..)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..))

list : Model -> Html Msg
list model =
  ul []
  [ li [] [text "Item 1"]
  , li [] [text "Item 2"]
  , li [] [text "Item 3"]
  , li [] [text "Item 4"]
  , li [] [text "Item 5"]
  , li [] [text "Item 6"]
  , li [] [text "Item 7"]
  , li [] [text "Item 8"]
  , li [] [text "Item 9"]
  , li [] [text "Item 10"]
  , li [] [text "Item 11"]
  , li [] [text "Item 12"]
  , li [] [text "Item 13"]
  , li [] [text "Item 14"]
  , li [] [text "Item 15"]
  , li [] [text "Item 16"]
  ]

podcastContextMenu : Podcast -> Menu PodcastContextMenu
podcastContextMenu podcast =
  let
    items =
    [ ContextMenu.actionItem (M_RenamePodcast podcast.id) "Rename"
    , ContextMenu.actionItem (M_ReloadPodcast podcast.id) "Reload"
    , ContextMenu.separatorItem
    , ContextMenu.actionItem (M_CopyPodcastFeed podcast.id) "Copy Podcast URL"
    , ContextMenu.actionItem (M_Unsubscribe podcast.id) "Unsubscribe"
    , ContextMenu.separatorItem
    , ContextMenu.actionItem M_RefreshAll "Refresh All"
    ]
  in
    Menu "Podcast" items