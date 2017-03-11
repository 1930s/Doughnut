module Ipc exposing (..)

import Types exposing (..)
import Ports exposing (ObjAction, FloatAction, objectAction, globalAction, floatAction)

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

reloadPodcast : PodcastId -> Cmd msg
reloadPodcast id =
  objectAction (ObjAction "podcast:reload" id)

unsubscribePodcast : PodcastId -> Cmd msg
unsubscribePodcast id =
  objectAction (ObjAction "podcast:unsubscribe" id)

playEpisode : EpisodeId -> Cmd msg
playEpisode id =
  objectAction (ObjAction "episode:play" id)

downloadEpisode : EpisodeId -> Cmd msg
downloadEpisode id =
  objectAction (ObjAction "episode:download" id)

favouriteEpisode : EpisodeId -> Cmd msg
favouriteEpisode id =
  objectAction (ObjAction "episode:favourite" id)
