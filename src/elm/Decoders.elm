module Decoders exposing (..)

import Types exposing (..)
import Json.Decode.Extra exposing ((|:), date)
import Json.Decode as Json exposing (Decoder, decodeValue, succeed, string, (:=), maybe)

podcastDecoder : Decoder Podcast
podcastDecoder =
  succeed Podcast
    |: ("id" := Json.int)
    |: ("title" := Json.string)
    |: ("feed" := Json.string)
    |: ("description" := Json.string)
    |: ("link" := Json.string)
    |: ("author" := Json.string)
    |: ("pubDate" := date)
    |: ("language" := Json.string)
    |: ("copyright" := Json.string)
    |: ("imageUrl" := Json.string)
    |: ("imageBlob" := Json.string)
    |: ("lastParsed" := date)
