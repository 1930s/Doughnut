module Player exposing (Msg(..), init, update, view, volumeControl)

import Types exposing (PlayerState, PlayerModel)
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
  | SeekPreview String
  | StartSeeking
  | FinishSeeking
  | SlideVolume String
  | AdjustVolume

init : PlayerModel
init = 
  let
    state = PlayerState True 50 0.0 0.0 ""
  in
    PlayerModel state False 0.0 0

update : Msg -> PlayerModel -> (PlayerModel, Cmd Msg)
update msg model =
  let
    { state } = model
  in
    case msg of
      State newState ->
        { model | state = newState } ! []
      
      StartSeeking ->
        { model | seeking = True } ! []
      
      FinishSeeking ->
        let
          updated = { state | position = model.seekingPosition }
        in
          { model | state = updated, seeking = False } ! [ Ipc.seekTo model.seekingPosition ]

      Toggle ->
        let
          updated = { state | pause = (not state.pause) }
        in
          { model | state = updated } ! [ Ipc.toggle ]
      
      SkipForward ->
        let
          newPosition = Basics.min (Basics.max 0 (state.duration - 1)) (state.position + 30.0)
          updated = { state | position = newPosition }
        in
          { model | state = updated } ! [ Ipc.seekTo newPosition ]
      
      SkipBack ->
        let
          newPosition = Basics.max 0 (state.position - 30.0)
          updated = { state | position = newPosition }
        in
          { model | state = updated } ! [ Ipc.seekTo newPosition ]
      
      SeekPreview pos ->
        let
          position = (String.toInt pos) |> Result.withDefault 0 |> toFloat
          updated = { state | position = position }
        in
          { model | state = updated, seekingPosition = position } ! []
      
      SlideVolume volStr ->
        { model | adjustingVolume = (String.toInt volStr) |> Result.withDefault 0 } ! []
      
      AdjustVolume ->
        let
          updated = { state | volume = model.adjustingVolume }
        in
          { model | state = updated } ! [ Ipc.setVolume model.adjustingVolume ]


timestamp : Int -> String
timestamp total =
  let
    hours = (toFloat total) / 3600 |> floor
    mins = ((toFloat (rem total 3600)) / 60) |> floor
    secs = rem total 60
  in
    (toString hours) ++ ":" ++ (String.padLeft 2 '0' (toString mins)) ++ ":" ++ (String.padLeft 2 '0' (toString secs))

view : PlayerModel -> Html Msg
view model =
  let
    { state } = model

    position = if model.seeking then
        model.seekingPosition
      else
        state.position

    positionStr = timestamp (round position)
    remainingStr = timestamp (round (state.duration - position))
  in
    div [ classList 
      [ ("player", True)
      , ("player--playing", (not state.pause))
      ]
    ]
    [ button [class "player-control", onClick SkipBack] [ Icons.skipBackIcon ]
    , button [class "player-control", onClick Toggle]
      [ if state.pause then
          Icons.playIcon
        else
          Icons.pauseIcon
      ]
    , button [class "player-control", onClick SkipForward] [ Icons.skipForwardIcon ]
    , div [class "seek-bar"]
      [ span [] [text positionStr]
      , div []
        [ span [] [text state.title]
        , input
          [ type_ "range"
          , H.min "0"
          , H.max (toString state.duration)
          , value (toString position)
          , onInput SeekPreview
          , onMouseDown StartSeeking
          , onMouseUp FinishSeeking
          ] []
        ]
      , span [] [text remainingStr]
      ]
    ]

volumeControl : PlayerModel -> Html Msg
volumeControl model =
  div []
  [ input
    [ type_ "range"
    , class "volume-slider"
    , H.min "0"
    , H.max "100"
    , onInput SlideVolume
    , onMouseUp AdjustVolume
    ] []
  ]