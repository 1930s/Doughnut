module Podcasts exposing (list)

import Html exposing (..)
import Html.Attributes exposing (..)
import Model exposing (Model, Msg(..), PodcastContextMenu(..))
import Types exposing (..)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..))

list : Model -> Html Msg
list model =
  ul []
    (List.map (viewPodcast) model.podcasts)

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

viewPodcast : Podcast -> Html Msg
viewPodcast pod =
  li [] [text pod.title]