port module Ports exposing (..)

import Types exposing (..)
import Json.Encode

port globalAction : String -> Cmd msg

type alias ObjAction =
  { action : String
  , id : Int
  }
port objectAction : ObjAction -> Cmd msg

-- Action -> Main


-- Main -> Elm
port podcastState : (Json.Encode.Value -> msg) -> Sub msg
port podcastsState : (Json.Encode.Value -> msg) -> Sub msg