module Types exposing (..)

type alias PodcastId = Int

type alias Podcast =
  { id_ : PodcastId
  , name : String
  , description : String
  }

type alias Episode =
  { name : String
  }