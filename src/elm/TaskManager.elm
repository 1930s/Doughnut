module TaskManager exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Model exposing (..)
import Types exposing (..)
import Icons

view : Model -> Html Msg
view model =
  if True then
    div [class "tasks"] 
      (List.map taskView model.tasks.tasks)
  else
    div [] [text ""]

taskView : LibraryTask -> Html Msg
taskView task =
  div [class "task"]
  [ progressBar task.progress 100
  , div [class "task-info"]
    [ span [] [text task.description]
    , span [] [text ((toString task.progress) ++ "%")]
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