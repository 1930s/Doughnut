module Model exposing (..)

import Mouse exposing (Position)
import ContextMenu exposing (Menu, MenuCallback)
import SplitPane.SplitPane as SplitPane
import Types exposing (..)
import Json.Encode
import Player
import Http

type alias Model =
  { state : GlobalState
  , loadCount : Int
  , podcasts : List Podcast
  , player : PlayerState
  , selectedPodcast : Maybe Podcast
  , selectedEpisode : Maybe Episode
  , splitPane : SplitPane.State
  , podcastContextMenu : Maybe (Menu PodcastContextMenu)
  , episodeContextMenu : Maybe (Menu EpisodeContextMenu)
  }

type PodcastContextMenu
  = M_RenamePodcast PodcastId
  | M_ReloadPodcast PodcastId
  | M_CopyPodcastFeed PodcastId
  | M_Unsubscribe PodcastId
  | M_RefreshAll

type EpisodeContextMenu
  = M_DownloadEpisode EpisodeId
  | M_FavouriteEpisode EpisodeId

type Msg
  = --OpenContextMenu (Menu ButtonMenuItem)
  --| MenuAction String
  SplitterMsg SplitPane.Msg
  | SelectPodcast Podcast
  | SelectEpisode Episode
  | PlayEpisode Episode
  | ShowPodcastContextMenu (Menu PodcastContextMenu)
  | ShowEpisodeContextMenu (Menu EpisodeContextMenu)
  | HandlePodcastContextMenu MenuCallback
  | HandleEpisodeContextMenu MenuCallback
  | PodcastsUpdated (List Int)
  | PodcastLoaded (Result Http.Error Podcast)
  | PlayerState Json.Encode.Value
  | PlayerMsg Player.Msg