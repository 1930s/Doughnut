module MainWindow.PodcastSettings exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import MainWindow.Model exposing (Model, Msg(..), selectedPodcast)
import Types exposing (..)

view : Podcast -> Html Msg
view podcast =
  div [class "podcast-settings"]
  [ h1 [] [text podcast.title]
  ]