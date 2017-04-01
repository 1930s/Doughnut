module MainWindow.Player exposing (Msg(..), init, update, view, volumeControl)

import Types exposing (..)
import Html exposing (..)
import Html.Attributes as H exposing (..)
import Html.Events exposing (..)
import Ipc
import Icons
import MD5

type Msg
  = State PlayerState
  | Toggle
  | SkipForward
  | SkipBack
  | SeekPreview String
  | StartSeeking
  | FinishSeeking
  | SlideVolume String
  | ShowSeekDetail Bool

init : PlayerModel
init = 
  let
    state = PlayerState True 50 0.0 0.0 "" False 0
  in
    PlayerModel state False 0.0 False

update : Msg -> PlayerModel -> (PlayerModel, Cmd Msg)
update msg model =
  let
    { state } = model
  in
    case msg of
      State newState ->
        { model | state = newState } ! []
      
      ShowSeekDetail toggle ->
        { model | showSeekDetail = toggle } ! []
      
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
        let
          newVolume = (String.toInt volStr) |> Result.withDefault 0
          updated = { state | volume = newVolume }
        in
          { model | state = updated } ! [ Ipc.setVolume newVolume ]


timestamp : Int -> String
timestamp total =
  let
    hours = (toFloat total) / 3600 |> floor
    mins = ((toFloat (rem total 3600)) / 60) |> floor
    secs = rem total 60
  in
    (toString hours) ++ ":" ++ (String.padLeft 2 '0' (toString mins)) ++ ":" ++ (String.padLeft 2 '0' (toString secs))

coverImageUrl : GlobalState -> PlayerModel -> String
coverImageUrl state model =
  (assetServerUrl state) ++ "/player/image?" ++ (MD5.hex model.state.title)

view : GlobalState -> PlayerModel -> Html Msg
view globalState model =
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
    , if state.ready then
        div [class "player-minicover"]
        [ img [src (coverImageUrl globalState model)] []
        ]
      else
        text ""
    , div
      [ class "seek-bar"
      , onMouseOver (ShowSeekDetail True)
      , onMouseLeave (ShowSeekDetail False)
      ]
      [ if state.ready then
          div []
          [ span []
            [ if model.showSeekDetail then
                text positionStr
              else
                text state.title
            ]
          , span [] [text ("- " ++ remainingStr)]
          ]
        else
          text ""
      , div []
        [ input
          [ type_ "range"
          , H.min "0"
          , H.max (toString state.duration)
          , value (toString position)
          , onInput SeekPreview
          , onMouseDown StartSeeking
          , onMouseUp FinishSeeking
          ] []
        ]
      ]
    ]

volumeControl : PlayerModel -> Html Msg
volumeControl model =
  let
    { volume } = model.state
  in
    div [class "volume-slider"]
    [ Icons.volumeIcon
    , input
      [ type_ "range"
      , H.min "0"
      , H.max "100"
      , value (toString model.state.volume)
      , onInput SlideVolume
      ] []
    ]