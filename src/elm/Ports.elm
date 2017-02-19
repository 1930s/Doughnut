port module Ports exposing (..)

import Types exposing (..)
import Json.Encode

port globalIpc : String -> Cmd msg

-- Action -> Main


-- Main -> Elm
port podcastState : (Json.Encode.Value -> msg) -> Sub msg
port podcastsState : (Json.Encode.Value -> msg) -> Sub msg