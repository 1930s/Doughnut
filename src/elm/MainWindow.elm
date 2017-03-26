module Main exposing (main)

import Html as App
import MainWindow.Model exposing (Model, Msg)
import Types exposing (GlobalState)
import MainWindow.Update
import MainWindow.View

main : Program GlobalState Model Msg
main =
  App.programWithFlags
    { init = MainWindow.Update.init
    , view = MainWindow.View.view
    , update = MainWindow.Update.update
    , subscriptions = MainWindow.Update.subscriptions
    }