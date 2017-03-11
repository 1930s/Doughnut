port module Ports exposing (..)

import Types exposing (..)
import Json.Encode

port errorDialog : String -> Cmd msg

port globalAction : String -> Cmd msg

type alias ObjAction =
  { action : String
  , id : Int
  }
port objectAction : ObjAction -> Cmd msg

type alias FloatAction =
  { action : String
  , arg : Float
  }
port floatAction : FloatAction -> Cmd msg

-- Action -> Main


-- Main -> Elm
port podcastsUpdated : (List Int -> msg) -> Sub msg

port playerState : (Json.Encode.Value -> msg) -> Sub msg