module Dialog exposing (..)

import Task exposing (Task)
import Platform

import Native.Dialog

chooseFolderNative : String -> Platform.Task Never String
chooseFolderNative defaultPath =
  Native.Dialog.chooseFolder defaultPath

chooseFolder : (String -> msg) -> String -> Cmd msg
chooseFolder callback defaultPath =
  Task.perform callback (chooseFolderNative defaultPath)