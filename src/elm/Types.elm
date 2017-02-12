module Types exposing (..)

import Date exposing (Date)

type alias PodcastId = Int

type alias Podcast =
  { id : PodcastId
  , name : String
  , feed : String
  , description : String
  , link : String
  , author : String
  , pubDate : Date
  , language : String
  , copyright : String
  , imageUrl : String
  , imageBlog : String
  , lastParsed : Date
  }

type alias Episode =
  { name : String
  }