module TaskManager exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Model exposing (..)
import Icons

view : Model -> Html Msg
view model =
  if True then
    div [class "tasks"] 
    [ taskView model
    ]
  else
    div [] [text ""]

taskView : Model -> Html Msg
taskView model =
  div [class "task"]
  [ progressBar 5 10
  , div [class "task-info"]
    [ span [] [text "#323: My Cousin Quinny Part II"]
    , span [] [text "50%"]
    ]
  ]

progressBar : Int -> Int -> Html Msg
progressBar progress total =
  let
    perc = ((toFloat progress) / (toFloat total)) * 100
  in
    div [class "progress-bar"]
    [ div [class "progress-bar-filled", style [
        ("width", (toString perc) ++ "%")
      ]] []
    ]