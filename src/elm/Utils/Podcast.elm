module Utils.Podcast exposing (imageUrl)

import Types exposing (..)

imageUrl : GlobalState -> Podcast -> String
imageUrl state pod = 
  (assetServerUrl state) ++ "/podcasts/image/" ++ (toString pod.id)