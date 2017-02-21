module Types exposing (..)

import Date exposing (Date)

type alias PodcastId = Int

type alias Podcast =
  { id : PodcastId
  , title : String
  , feed : String
  , description : String
  , link : String
  , author : String
  , pubDate : Date
  , language : String
  , copyright : String
  , imageUrl : String
  , imageBlob : String
  , lastParsed : Date
  , createdAt : Date
  , updatedAt : Date
  , episodes : List Episode
  }

type alias EpisodeId = Int

type alias Episode =
  { id : EpisodeId
  , podcastId : PodcastId
  , title : String
  , description : String
  , guid : String
  , pubDate : Date
  , link : String
  , enclosureUrl : String
  , enclosureSize : Int
  , favourite : Bool
  , createdAt : Date
  , updatedAt : Date
  }