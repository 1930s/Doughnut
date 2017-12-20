/*
 * Doughnut Podcast Client
 * Copyright (C) 2017 Chris Dyer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Cocoa

class SeekSlider: NSSlider {
  override var knobThickness: CGFloat {
    get {
      return 3.0
    }
  }
  
  var streamedValue: Double = 0 {
    didSet {
      if let cell = cell as? SeekSliderCell {
        cell.streamed = streamedValue
      }
    }
  }
}

class SeekSliderCell: NSSliderCell {
  var streamed: Double = 0
  
  override var knobThickness: CGFloat {
    return knobWidth
  }
  
  let knobWidth: CGFloat = 4.0
  let knobHeight: CGFloat = 17.0
  let knobRadius: CGFloat = 2.0
  
  override init() {
    super.init()
  }
  
  required init(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
  }
  
  var percentage: CGFloat {
    get {
      if (self.maxValue - self.minValue) > 0 {
        return CGFloat((self.doubleValue - self.minValue) / (self.maxValue - self.minValue))
      } else {
        return 0
      }
    }
  }
  
  var streamedPercentage: CGFloat {
    get {
      if (self.maxValue - self.minValue) > 0 {
        return CGFloat((self.streamed - self.minValue) / (self.maxValue - self.minValue))
      } else {
        return 0
      }
    }
  }
  
  override func drawBar(inside aRect: NSRect, flipped: Bool) {
    let progressColor = NSColor(calibratedRed: 0.478, green: 0.478, blue: 0.478, alpha: 1.0)
    let baseColor = NSColor(calibratedRed: 0.729, green: 0.729, blue: 0.729, alpha: 1.0)
    
    var rect = aRect
    rect.origin.x += 0.5
    rect.origin.y += 0.5
    rect.size.height = CGFloat(4)
    let barRadius = CGFloat(1)
    
    var progressRect = rect
    progressRect.size.width = CGFloat(percentage * (self.controlView!.frame.size.width - 8))
    
    var streamedRect = rect
    streamedRect.size.width = CGFloat(streamedPercentage * (self.controlView!.frame.size.width - 8))
    
    let bg = NSBezierPath(roundedRect: rect, xRadius: barRadius, yRadius: barRadius)
    baseColor.setStroke()
    bg.lineWidth = 1.0
    bg.stroke()
    
    let secondary = NSBezierPath(roundedRect: streamedRect, xRadius: barRadius, yRadius: barRadius)
    baseColor.setFill()
    secondary.fill()
    
    let active = NSBezierPath(roundedRect: progressRect, xRadius: barRadius, yRadius: barRadius)
    progressColor.setFill()
    active.fill()
  }
  
  override func drawKnob(_ knobRect: NSRect) {
    NSColor.white.setFill()
    NSColor(calibratedRed: 0.6, green: 0.6, blue: 0.6, alpha: 1.0).setStroke()
    
    let rect = NSMakeRect(round(knobRect.origin.x),
                          knobRect.origin.y + 0.5 * (knobRect.height - knobHeight),
                          knobRect.width,
                          knobHeight)
    let path = NSBezierPath(roundedRect: rect, xRadius: knobRadius, yRadius: knobRadius)
    path.fill()
    path.stroke()
  }
  
  override func knobRect(flipped: Bool) -> NSRect {
    let bounds = super.barRect(flipped: flipped)
    let pos = min(percentage * bounds.width, bounds.width - 1);
    let rect = super.knobRect(flipped: flipped)
    let flippedMultiplier = flipped ? CGFloat(-1) : CGFloat(1)
    return NSMakeRect(pos - flippedMultiplier * 0.5 * knobWidth, rect.origin.y, knobWidth, rect.height)
  }
}
