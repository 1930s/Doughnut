module Podcasts exposing (list)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Model exposing (Model, Msg(..), PodcastContextMenu(..))
import Types exposing (..)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..))
import Utils.Podcast exposing (imageUrl)

list : Model -> Html Msg
list model =
  ul []
    (List.map (\p -> viewPodcast p model.state) model.podcasts)

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

viewPodcast : Podcast -> GlobalState -> Html Msg
viewPodcast pod state =
  let
    epCount = List.length pod.episodes

    contextMenu = podcastContextMenu pod
  in
    li [ open (ShowPodcastContextMenu contextMenu), onClick (SelectPodcast pod) ]
    [ div [class "cover"]
      [ img [src (imageUrl pod)] []
      ]
    , h2 [] [ text pod.title ]
    , p [] [ text pod.author ]
    , p [] [ text ((toString epCount) ++ " Episodes") ]
    ]