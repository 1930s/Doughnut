module Decoders exposing (..)

import Types exposing (..)
import Json.Decode.Extra exposing ((|:), date)
import Json.Decode as Json exposing (Decoder, decodeValue, succeed, string, field, maybe, list)

podcastDecoder : Decoder Podcast
podcastDecoder =
  succeed Podcast
    |: (field "id" Json.int)
    |: (field "title" Json.string)
    |: (field "feed" Json.string)
    |: (field "description" Json.string)
    |: (field "link" Json.string)
    |: (field "author" Json.string)
    |: (field "pubDate" date)
    |: (field "language" Json.string)
    |: (field "copyright" Json.string)
    |: (field "imageUrl" Json.string)
    |: (field "imageBlob" Json.string)
    |: (field "lastParsed" date)
    |: (field "created_at" date)
    |: (field "updated_at" date)

podcastsDecoder : Decoder (List Podcast)
podcastsDecoder =
  list podcastDecoder