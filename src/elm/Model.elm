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
  , podcasts : List PodcastWrapped
  , player : PlayerModel
  , tasks : TaskState
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
  | SelectPodcast PodcastWrapped
  | SelectEpisode Episode
  | PlayEpisode Episode
  | ShowPodcastContextMenu (Menu PodcastContextMenu)
  | ShowEpisodeContextMenu (Menu EpisodeContextMenu)
  | HandlePodcastContextMenu MenuCallback
  | HandleEpisodeContextMenu MenuCallback
  | PodcastLoading Json.Encode.Value
  | PodcastUpdated Json.Encode.Value
  | EpisodeUpdated Json.Encode.Value
  | PlayerState Json.Encode.Value
  | TaskState Json.Encode.Value
  | PodcastsLoaded (Result Http.Error (List PodcastWrapped))
  | EpisodesLoaded (Result Http.Error (List Episode))
  | PlayerMsg Player.Msg

selectedPodcast : Model -> Maybe PodcastWrapped
selectedPodcast model =
  List.filter (\p -> p.selected == True) model.podcasts
    |> List.head