module Preferences exposing (main)

import Html as App exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Icons as Icons
import Dialog

type PreferenceView
  = Library
  | Playback

type Msg
  = ChangeView PreferenceView
  | BrowseLibraryPath
  | ChangeLibraryPath String

type alias Settings =
  { libraryPath : String
  }

type alias Model =
  { view : PreferenceView
  , settings : Settings
  , restartNeeded : Bool
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
    , restartNeeded = False
    }
  in
    model ! []

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  let
    { settings } = model
  in
    case msg of
      ChangeView newView ->
        { model | view = newView } ! []
      
      BrowseLibraryPath ->
        model ! [Dialog.chooseFolder ChangeLibraryPath model.settings.libraryPath]

      ChangeLibraryPath newPath ->
        if String.length newPath > 1 then
          { model | restartNeeded = True, settings = { settings | libraryPath = newPath }} ! []
        else
          model ! []

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
  let
    { settings } = model
  in
    div []
    [ div [class "form-row"]
      [ label [] [text "Library Path"]
      , div [class "form-control-pair"]
        [ div [] [ span [] [text settings.libraryPath] ]
        , div [] [ button
            [ class "small"
            , onClick BrowseLibraryPath
            ] [text "Change Location"]
          ]
        ]
      ]
    ]

playbackView : Model -> Html Msg
playbackView model =
  div []
  [ h1 [] [text "Playback"]
  ]