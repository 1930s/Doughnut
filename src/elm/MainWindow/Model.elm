module MainWindow.Model exposing (..)

import Mouse exposing (Position)
import ContextMenu exposing (Menu, MenuCallback)
import Types exposing (..)
import Json.Encode
import MainWindow.Player
import Http

type alias Model =
  { state : GlobalState
  , podcasts : List PodcastWrapped
  , showPodcastSettings : Bool
  , player : PlayerModel
  , tasks : TaskState
  , selectedEpisode : Maybe Episode
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
  = M_PlayEpisode EpisodeId
  | M_MarkPlayed EpisodeId
  | M_MarkUnplayed EpisodeId
  | M_MarkFavourite EpisodeId
  | M_UnmarkFavourite EpisodeId
  | M_DeleteEpisode EpisodeId
  | M_ShowFinder EpisodeId
  | M_DownloadEpisode EpisodeId
  | M_MarkAllPlayed PodcastId
  | M_MarkAllUnplayed PodcastId

type Msg
  = SelectPodcast PodcastWrapped
  | SelectEpisode Episode
  | PlayEpisode Episode
  | ShowPodcastContextMenu (Menu PodcastContextMenu)
  | ShowEpisodeContextMenu (Menu EpisodeContextMenu)
  | HandlePodcastContextMenu MenuCallback
  | HandleEpisodeContextMenu MenuCallback
  | ToggleShowPodcastSettings
  | PodcastSubscribe
  | PodcastLoading Json.Encode.Value
  | PodcastUpdated Json.Encode.Value
  | EpisodeUpdated Json.Encode.Value
  | PlayerState Json.Encode.Value
  | TaskState Json.Encode.Value
  | PodcastsLoaded (Result Http.Error (List PodcastWrapped))
  | EpisodesLoaded (Result Http.Error (List Episode))
  | PlayerMsg MainWindow.Player.Msg

selectedPodcast : Model -> Maybe PodcastWrapped
selectedPodcast model =
  List.filter (\p -> p.selected == True) model.podcasts
    |> List.head

findPodcast : PodcastId -> Model -> Maybe Podcast
findPodcast id model =
  case List.filter (\p -> p.podcast.id == id) model.podcasts |> List.head of
    Just pw -> Just pw.podcast
    Nothing -> Nothing