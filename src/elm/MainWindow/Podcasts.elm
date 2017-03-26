module MainWindow.Podcasts exposing (list)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import MainWindow.Model exposing (Model, Msg(..), PodcastContextMenu(..))
import Types exposing (..)
import ContextMenu exposing (open, Menu, MenuItem, MenuItemType(..))
import Utils.Podcast exposing (imageUrl)
import Icons

list : Model -> Html Msg
list model =
  div [class "podcasts-list"]
  [ ul []
      (List.map (viewPodcast model.state) model.podcasts)
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

viewPodcast : GlobalState -> PodcastWrapped -> Html Msg
viewPodcast globalState pw =
  let
    epCount = List.length pw.episodes
    unplayedEpCount = List.filter (\e -> not (e.played || e.playPosition > 0)) pw.episodes
      |> List.length

    pod = pw.podcast
    contextMenu = podcastContextMenu pod
  in
    li
    [ open (ShowPodcastContextMenu contextMenu)
    , onClick (SelectPodcast pw)
    , classList 
      [ ("podcast--selected", pw.selected)
      ]
    ]
    [ div [class "podcast-list-cover"]
      [ img [src (imageUrl globalState pod)] []
      ]
    , div [class "podcast-list-detail"]
      [ h2 [] [ text pod.title ]
      , p [] [ text pod.author ]
      , p [] [ text ((toString epCount) ++ " Episodes") ]
      ]
    , if pw.loading then
        div [class "podcast-list-loading"]
        [ Icons.spinner
        ]
      else if unplayedEpCount > 0 then
        div [class "podcast-list-unplayed"] [text (toString unplayedEpCount)]
      else
        text ""
    ]