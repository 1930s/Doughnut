module Ipc exposing (..)

import Types exposing (..)
import Ports exposing (ObjAction, FloatAction, StringAction, objectAction, globalAction, floatAction, stringAction, saveSettings)

clipboardSet : String -> Cmd msg
clipboardSet str =
  stringAction (StringAction "clipboard:set" str)

play : Cmd msg
play =
  globalAction "player:play"

pause : Cmd msg
pause =
  globalAction "player:pause"

toggle : Cmd msg
toggle =
  globalAction "player:toggle"

seekTo : Float -> Cmd msg
seekTo pos =
  floatAction (FloatAction "player:seek" pos)

setVolume : Int -> Cmd msg
setVolume volume =
  floatAction (FloatAction "player:volume" (toFloat volume))

reloadPodcast : PodcastId -> Cmd msg
reloadPodcast id =
  objectAction (ObjAction "podcast:reload" id)

podcastSubscribe : Cmd msg
podcastSubscribe =
  globalAction "podcast:subscribe:new"

unsubscribePodcast : PodcastId -> Cmd msg
unsubscribePodcast id =
  objectAction (ObjAction "podcast:unsubscribe" id)

markAllPlayedPodcast : PodcastId -> Cmd msg
markAllPlayedPodcast id =
  objectAction (ObjAction "podcast:played" id)

markAllUnplayedPodcast : PodcastId -> Cmd msg
markAllUnplayedPodcast id =
  objectAction (ObjAction "podcast:unplayed" id)

playEpisode : EpisodeId -> Cmd msg
playEpisode id =
  objectAction (ObjAction "episode:play" id)

downloadEpisode : EpisodeId -> Cmd msg
downloadEpisode id =
  objectAction (ObjAction "episode:download" id)

markPlayedEpisode : EpisodeId -> Cmd msg
markPlayedEpisode id =
  objectAction (ObjAction "episode:played" id)

markUnplayedEpisode : EpisodeId -> Cmd msg
markUnplayedEpisode id =
  objectAction (ObjAction "episode:unplayed" id)

favouriteEpisode : EpisodeId -> Cmd msg
favouriteEpisode id =
  objectAction (ObjAction "episode:favourite" id)

unFavouriteEpisode : EpisodeId -> Cmd msg
unFavouriteEpisode id =
  objectAction (ObjAction "episode:unfavourite" id)

revealEpisode : EpisodeId -> Cmd msg
revealEpisode id =
  objectAction (ObjAction "episode:reveal" id)

settingsSave : Settings -> Cmd msg
settingsSave settings =
  saveSettings settings