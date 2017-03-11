module Utils.Podcast exposing (imageUrl)

import Types exposing (..)

imageUrl : Podcast -> String
imageUrl pod = 
  "http://localhost:" ++ (toString serverPort) ++ "/podcasts/image/" ++ (toString pod.id)