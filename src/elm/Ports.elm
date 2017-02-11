port module Ports exposing (..)

import Types exposing (..)

port globalIpc : String -> Cmd msg

port podcastState : (List Podcast -> msg) -> Sub msg