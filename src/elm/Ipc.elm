module Ipc exposing (..)

import Types exposing (..)
import Ports exposing (ObjAction, objectAction, globalAction)
import Model exposing (..)

play : Cmd Msg
play =
  globalAction "play"

pause : Cmd Msg
pause =
  globalAction "pause"

reloadPodcast : PodcastId -> Cmd Msg
reloadPodcast id =
  objectAction (ObjAction "podcast:reload" id)

playEpisode : Episode -> Cmd Msg
playEpisode ep =
  objectAction (ObjAction "episode:play" ep.id)