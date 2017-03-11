module Player exposing (Msg(..), init, update, view)

import Types exposing (PlayerState)
import Html exposing (..)
import Html.Attributes as H exposing (..)
import Html.Events exposing (..)
import Ipc
import Icons

type Msg
  = State PlayerState
  | Toggle
  | SkipForward
  | SkipBack
  | SeekTo String

init : PlayerState
init = 
  PlayerState True 50 0.0 0.0

update : Msg -> PlayerState -> (PlayerState, Cmd Msg)
update msg model =
  case msg of
    State newState ->
      newState ! []

    Toggle ->
      { model | pause = (not model.pause) } ! [ Ipc.toggle ]
    
    SkipForward ->
      let
        newPosition = Basics.min (Basics.max 0 (model.duration - 1)) (model.position + 30.0)
      in
        { model | position = newPosition } ! [ Ipc.seekTo newPosition ]
    
    SkipBack ->
      let
        newPosition = Basics.max 0 (model.position - 30.0)
      in
        { model | position = newPosition } ! [ Ipc.seekTo newPosition ]
    
    SeekTo pos ->
      { model | position = (String.toInt pos) |> Result.withDefault 0 |> toFloat } ! []

timestamp : Int -> String
timestamp total =
  let
    hours = (toFloat total) / 3600 |> floor
    mins = ((toFloat (rem total 3600)) / 60) |> floor
    secs = rem total 60
  in
    (toString hours) ++ ":" ++ (String.padLeft 2 '0' (toString mins)) ++ ":" ++ (String.padLeft 2 '0' (toString secs))

view : PlayerState -> Html Msg
view model =
  let
    position = timestamp (round model.position)
    remaining = timestamp (round (model.duration - model.position))
  in
    div [class "player"]
    [ button [class "player-control", onClick SkipBack] [ Icons.skipBackIcon ]
    , button [class "player-control", onClick Toggle]
      [ if model.pause then
          Icons.playIcon
        else
          Icons.pauseIcon
      ]
    , button [class "player-control", onClick SkipForward] [ Icons.skipForwardIcon ]
    , div [class "seek-bar"]
      [ span [] [text position]
      , input
        [type_ "range"
        , H.min "0"
        , H.max (toString model.duration)
        , value (toString model.position)
        , onInput SeekTo
        ] []
      , span [] [text remaining]
      ]
    ]