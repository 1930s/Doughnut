module TaskManager exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Model exposing (..)
import Icons

view : Model -> Html Msg
view model =
  if True then
    div [class "tasks"] []
  else
    div [] [text ""]

taskView : Model -> Html Msg
taskView model =
  div [class "task"] []