module Preferences exposing (main)

import Html as App exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Preferences.Icons as Icons

type PreferenceView
  = Library
  | Playback

type Msg
  = ChangeView PreferenceView

type alias Settings =
  { libraryPath : String
  }

type alias Model =
  { view : PreferenceView
  , settings : Settings
  }

main : Program Settings Model Msg
main =
  App.programWithFlags
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

init : Settings -> (Model, Cmd Msg)
init settings =
  let
    model =
    { view = Library
    , settings = settings
    }
  in
    model ! []

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    ChangeView newView ->
      { model | view = newView } ! []

view : Model -> Html Msg
view model =
  div [class "preferences"]
  [ div [class "preference-tabs"]
    [ div [onClick (ChangeView Library)]
      [ Icons.libraryIcon
      , span [] [text "Library"]
      ]
    , div [onClick (ChangeView Playback)] [text "Playback"]
    ]
  , div [class "preference-view"]
    [ case model.view of
      Library ->
        libraryView model
      Playback ->
        playbackView model
    ]
  , div [class "preference-gutter"]
    []
  ]

libraryView : Model -> Html Msg
libraryView model =
  div []
  [ h1 [] [text "Library"]
  ]

playbackView : Model -> Html Msg
playbackView model =
  div []
  [ h1 [] [text "Playback"]
  ]