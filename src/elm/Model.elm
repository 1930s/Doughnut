module Model exposing (..)

import Mouse exposing (Position)
import ContextMenu exposing (Menu, MenuCallback)
import SplitPane.SplitPane as SplitPane
import Types exposing (..)
import Json.Encode

type alias Model =
  { test : String
  , podcasts : List Podcast
  , splitPane : SplitPane.State
  }

type PodcastContextMenu
  = M_RenamePodcast PodcastId
  | M_ReloadPodcast PodcastId
  | M_CopyPodcastFeed PodcastId
  | M_Unsubscribe PodcastId
  | M_RefreshAll

type Msg
  = --OpenContextMenu (Menu ButtonMenuItem)
  --| MenuAction String
  SplitterMsg SplitPane.Msg
  | ShowPodcastContextMenu (Menu PodcastContextMenu)
  | HandlePodcastContextMenu MenuCallback
  | PodcastState Json.Encode.Value
  | FullPodcastState Json.Encode.Value