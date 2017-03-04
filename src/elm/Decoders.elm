module Decoders exposing (..)

import Types exposing (..)
import Json.Decode.Extra exposing ((|:), date)
import Json.Decode as Json exposing (Decoder, decodeValue, succeed, string, field, maybe, list)
import Json.Decode.Pipeline exposing (decode, required, optional, hardcoded)

episodeDecoder : Decoder Episode
episodeDecoder =
  decode Episode
    |> required "id" Json.int
    |> required "podcast_id" Json.int
    |> required "title" Json.string
    |> required "description" Json.string
    |> required "guid" Json.string
    |> required "pubDate" date
    |> required "link" Json.string
    |> required "enclosureUrl" Json.string
    |> required "enclosureSize" Json.int
    |> required "favourite" Json.bool
    |> required "created_at" date
    |> required "updated_at" date

podcastDecoder : Decoder Podcast
podcastDecoder =
  decode Podcast
    |> required "id" Json.int
    |> required "title" Json.string
    |> required "feed" Json.string
    |> required "description" Json.string
    |> required "link" Json.string
    |> required "author" Json.string
    |> required "pubDate" date
    |> required "language" Json.string
    |> required "copyright" Json.string
    |> required "imageUrl" Json.string
    |> required "lastParsed" date
    |> required "created_at" date
    |> required "updated_at" date
    |> optional "episodes" (list episodeDecoder) []

podcastsDecoder : Decoder (List Podcast)
podcastsDecoder =
  list podcastDecoder