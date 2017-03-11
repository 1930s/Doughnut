module Icons exposing (..)

import Svg exposing (..)
import Svg.Attributes exposing (..)

skipForwardIcon : Svg msg
skipForwardIcon =
  svg [ width "11px", height "8px", viewBox "328 230 11 8" ] 
    [ g
      [ stroke "none"
      , strokeWidth "1"
      , fill "none"
      , fillRule "evenodd"
      , transform "translate(328.000000, 230.000000)"
      ]
      [ polygon [ fill "#646464", points "5 4 0 8 0 0" ] []
      , polygon [ fill "#646464", points "11 4 6 8 6 0" ] []
      ]
    ]

skipBackIcon : Svg msg
skipBackIcon =
  svg [ width "11px", height "8px", viewBox "260 230 11 8" ] 
    [ g
      [ stroke "none"
      , strokeWidth "1"
      , fill "none"
      , fillRule "evenodd"
      , transform "translate(265.500000, 234.000000) rotate(-180.000000) translate(-265.500000, -234.000000) translate(260.000000, 230.000000)"
      ]
      [ polygon [ fill "#646464", points "5 4 0 8 0 0" ] []
      , polygon [ fill "#646464", points "11 4 6 8 6 0" ] []
      ]
    ]

playIcon : Svg msg
playIcon =
  svg [ width "8px", height "12px", viewBox "296 228 8 12" ] 
    [ polygon [ stroke "none", fill "#646464", points "304 234 296 240 296 228", fillRule "evenodd" ] []
    ]

pauseIcon : Svg msg
pauseIcon =
  svg [ width "11px", height "13px", viewBox "294 228 11 13" ] 
    [ g [ stroke "none", strokeWidth "1", fill "none", fillRule "evenodd", transform "translate(294.000000, 228.000000)"
      ]
      [ rect [ fill "#646464", x "0", y "0", width "4", height "12" ] []
      , rect [ fill "#646464", x "7", y "0", width "4", height "12" ] []
      ]
    ]

bookmarkIcon : Svg msg
bookmarkIcon =
  svg [ width "17px", height "27px", viewBox "343 463 17 27" ] 
    [ g [ stroke "none", strokeWidth "1", fill "none", fillRule "evenodd", transform "translate(344.000000, 465.000000)"
      ]
      [ polygon [ fill "#FED530", fillRule "nonzero", points "7.28571429 1 0.173469388 1 0.173469388 25 7.28571429 18.2237714 14.3979592 25 14.3979592 1" ] []
      , Svg.path [ d "M1,1.5 L14,1.5", id "Line", strokeOpacity "0.697860054", stroke "#CBAB25", strokeWidth "3", strokeLinecap "square" ] []
      ]
    ]