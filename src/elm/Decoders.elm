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
    |> required "downloaded" Json.bool
    |> required "played" Json.bool
    |> required "playPosition" Json.int
    |> required "created_at" date
    |> required "updated_at" date

episodeListDecoder : Decoder (List Episode)
episodeListDecoder =
  list episodeDecoder

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
    |> optional "language" Json.string "en"
    |> required "copyright" Json.string
    |> required "imageUrl" Json.string
    |> required "lastParsed" date
    |> required "created_at" date
    |> required "updated_at" date

podcastListDecoder : Decoder (List Podcast)
podcastListDecoder =
  list podcastDecoder

taskStateDecoder : Decoder TaskState
taskStateDecoder =
  decode TaskState
    |> required "processing" Json.bool

playerStateDecoder : Decoder PlayerState
playerStateDecoder =
  decode PlayerState
    |> required "pause" Json.bool
    |> required "volume" Json.int
    |> optional "duration" Json.float 0.0
    |> optional "position" Json.float 0.0

podcastLoadingDecoder : Decoder PodcastLoadingIpc
podcastLoadingDecoder =
  decode PodcastLoadingIpc
    |> required "id" Json.int
    |> required "loading" Json.bool

podcastWrappedDecoder : Decoder PodcastWrapped
podcastWrappedDecoder =
  decode PodcastWrapped
    |> required "podcast" podcastDecoder
    |> required "episodes" episodeListDecoder
    |> required "loading" Json.bool
    |> required "selected" Json.bool

podcastsStateDecoder : Decoder (List PodcastWrapped)
podcastsStateDecoder =
  list podcastWrappedDecoder