module Icons exposing (..)

import Svg exposing (..)
import Svg.Attributes exposing (..)
import Html exposing (Html)
import Html.Attributes as A

spinner : Html msg
spinner =
  Html.div [A.class "loading"] []

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

downloadedIcon : Svg msg
downloadedIcon =
  svg [ width "30px", height "30px", viewBox "803 606 30 30" ] 
    [ g [ stroke "none", strokeWidth "1", fill "none", fillRule "evenodd", transform "translate(803.000000, 606.000000)"
      ]
      [ polygon [ fill "#1971EC", points "0 0 30 0 30 30" ] []
      , Svg.path [ d "M18.0985544,10.950292 C19.1872692,12.2583624 20.2761672,13.5664327 21.364882,14.8745031 C21.4451474,14.9705284 21.539157,15.00553 21.6300512,14.9992994 C21.7209454,15.00553 21.8153214,14.9707117 21.8952204,14.8745031 C22.9839352,13.5664327 24.0728332,12.2583624 25.1615479,10.950292 C25.3631278,10.7085794 25.2460282,10.3100009 24.896562,10.3100009 L23.5260019,10.3100009 L23.5260019,4.37512189 C23.5260019,4.1706099 23.3553919,4 23.15088,4 L20.1092224,4 C19.9047104,4 19.7341005,4.1706099 19.7341005,4.37512189 L19.7341005,10.3100009 L18.3635404,10.3100009 C18.0140741,10.3100009 17.8969745,10.7085794 18.0985544,10.950292 Z", fill "#FFFFFF", fillRule "nonzero" ] []
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

cogIcon : Svg msg
cogIcon =
  svg [ width "17px", height "27px", viewBox "6 5 88 90" ] 
    [ g [ stroke "none", strokeWidth "1", fill "none", fillRule "evenodd", transform "translate(6.000000, 5.637820)"
      ]
      [ Svg.path [ d "M37.84375,0.36219 L34.8125,11.04969 C32.03399,11.81515 29.38869,12.90505 26.9375,14.29969 L17.21875,8.89344 L8.53125,17.58094 L13.9375,27.29969 C12.54285,29.75087 11.45297,32.39617 10.6875,35.17467 L0,38.20597 L0,50.5184 L10.6875,53.5497 C11.45297,56.3282 12.54285,58.9735 13.9375,61.4247 L8.53125,71.1434 L17.21875,79.8309 L26.9375,74.4247 C29.38869,75.8193 32.03399,76.9092 34.8125,77.6747 L37.84375,88.3622 L50.15625,88.3622 L53.1875,77.6747 C55.96602,76.9092 58.61131,75.8193 61.0625,74.4247 L70.78125,79.8309 L79.46875,71.1434 L74.0625,61.4247 C75.45713,58.9735 76.54704,56.3282 77.3125,53.5497 L88,50.5184 L88,38.20597 L77.3125,35.17467 C76.54704,32.39617 75.45713,29.75087 74.0625,27.29969 L79.46875,17.58094 L70.78125,8.89344 L61.0625,14.29969 C58.61131,12.90505 55.96602,11.81515 53.1875,11.04969 L50.15625,0.36219 L37.84375,0.36219 Z M44,24.36219 C55.04568,24.36219 64,33.31657 64,44.3622 C64,55.4078 55.04568,64.3622 44,64.3622 C32.95432,64.3622 24,55.4078 24,44.3622 C24,33.31657 32.95432,24.36219 44,24.36219 Z", fill "#888888", fillRule "nonzero" ] []
      ]
    ]

plusIcon : Svg msg
plusIcon =
  svg [ width "17px", height "27px", viewBox "70 -22 87 87" ] 
    [ g [ stroke "none", strokeWidth "1", fill "none", fillRule "evenodd", transform "translate(70.000000, -22.000000)"
      ]
      [ rect [ fill "#888888", x "37", y "0", width "13", height "87"] []
      , rect [ fill "#888888", transform "translate(43.500000, 43.500000) rotate(-90.000000) translate(-43.500000, -43.500000)", x "37", y "-3.55271368e-15", width "13", height "87"] []
      ]
    ]

volumeIcon : Svg msg
volumeIcon =
  svg [ width "13px", height "12px", viewBox "689 -177 13 12" ] 
    [ g [ stroke "none", strokeWidth "1", fill "none", fillRule "evenodd", transform "translate(689.000000, -177.000000)"
      ]
      [ g [ fillRule "nonzero", fill "#404040"]
        [ Svg.path [d "M1.13318919,2.69172973 C0.34572973,2.69172973 0,4.54572973 0,5.96789189 C0,7.39005405 0.368918919,9.20108108 1.04691892,9.20108108 L2.81091892,9.20108108 C3.85654054,9.20108108 5.48091892,10.9845405 6.30259459,11.669027 C6.89335135,12.1611892 7.92389189,11.9852432 7.92389189,10.9391351 L7.926,0.949621622 C7.926,-0.059027027 6.88621622,-0.225891892 6.30324324,0.287837838 C5.44994595,1.03962162 3.87956757,2.69156757 2.85454054,2.69156757 C2.52308108,2.69172973 1.65454054,2.69172973 1.13318919,2.69172973 Z"] []
        , Svg.path [d "M11.2829189,2.21643243 C10.9741622,1.91124324 10.4834595,1.91124324 10.1734054,2.21854054 C9.86724324,2.52518919 9.86724324,3.02010811 10.175027,3.32789189 L10.175027,3.32627027 C10.8517297,4.0032973 11.2696216,4.93281081 11.2696216,5.964 C11.2696216,6.99324324 10.8531892,7.92048649 10.1766486,8.59605405 C9.86724324,8.90481081 9.86724324,9.39924324 10.175027,9.70913514 C10.3264865,9.86140541 10.5270811,9.93875676 10.728973,9.93875676 C10.9311892,9.93875676 11.1379459,9.86140541 11.2848649,9.70913514 C12.2412973,8.75156757 12.8361081,7.42378378 12.8361081,5.96659459 C12.8369189,4.50259459 12.24,3.17286486 11.2829189,2.21643243 Z"] []
        ]
      ]
    ]

playPosition : Int -> Int -> Svg msg
playPosition played total =
  let
    percent = if total > 0 then
        ((toFloat played) / (toFloat total)) * 100
      else
        0
  in
    svg [ width "14px", height "14px", viewBox "0 0 32 32", A.style [("transform", "rotate(-90deg)"), ("background", "#1971EC"), ("border-radius", "50%")] ] 
      [ circle [ r "16", cx "16", cy "16", fill "#1971EC", stroke "#FFF", strokeWidth "33", strokeDasharray ((toString percent) ++ " 100")] []
      ]