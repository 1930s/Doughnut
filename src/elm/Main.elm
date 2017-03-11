module Main exposing (main)

import Html as App
import Model exposing (Model, Msg)
import Types exposing (GlobalState)
import Update
import Window.Main

main : Program GlobalState Model Msg
main =
  App.programWithFlags
    { init = Update.init
    , view = Window.Main.view
    , update = Update.update
    , subscriptions = Update.subscriptions
    }