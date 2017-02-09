module Logger exposing (debug)

import Native.Logger

debug : String -> String
debug = Native.Logger.debug