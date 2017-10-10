//
//  PlayerView.swift
//  Doughnut
//
//  Created by Chris Dyer on 01/10/2017.
//  Copyright © 2017 Chris Dyer. All rights reserved.
//

import Cocoa

extension String {
  func leftPadding(toLength: Int, withPad character: Character) -> String {
    let newLength = self.characters.count
    if newLength < toLength {
      return String(repeatElement(character, count: toLength - newLength)) + self
    } else {
      return self.substring(from: index(self.startIndex, offsetBy: newLength - toLength))
    }
  }
}

class PlayerView: NSView, PlayerDelegate {
  let width = 425
  let baseline: CGFloat = 6
  
  var loadingIdc: NSProgressIndicator!
  var artworkImg: NSImageView!
  var reverseBtn: NSButton!
  var playBtn: NSButton!
  var forwardBtn: NSButton!
  var playedDurationLbl: NSTextField!
  var seekSlider: SeekSlider!
  var playedRemainingLbl: NSTextField!
  
  let playIcon = NSImage(imageLiteralResourceName: "PlayIcon")
  let pauseIcon = NSImage(imageLiteralResourceName: "PauseIcon")
  
  override init(frame frameRect: NSRect) {
    super.init(frame: frameRect)
  }
  
  required init?(coder decoder: NSCoder) {
    loadingIdc = NSProgressIndicator(frame: NSRect(x: 25, y: baseline + 5, width: 16, height: 16))
    artworkImg = NSImageView(frame: NSRect(x: 25, y: baseline + 3, width: 20, height: 20))
    
    reverseBtn = NSButton.init(frame: NSRect(x: PlayerView.controlX(artworkImg) + 6, y: baseline, width: 28, height: 25))
    playBtn = NSButton.init(frame: NSRect(x: PlayerView.controlX(reverseBtn) + 1, y: baseline, width: 28, height: 25))
    forwardBtn = NSButton.init(frame: NSRect(x: PlayerView.controlX(playBtn) + 1, y: baseline, width: 28, height: 25))
    
    playedDurationLbl = NSTextField(frame: NSRect(x: PlayerView.controlX(forwardBtn) + 2, y: baseline + 6, width: 50, height: 14))
    seekSlider = SeekSlider(frame: NSRect(x: PlayerView.controlX(playedDurationLbl) + 4, y: baseline + 4, width: 200, height: 18))
    playedRemainingLbl = NSTextField(frame: NSRect(x: PlayerView.controlX(seekSlider) + 4, y: baseline + 6, width: 50, height: 14))
    
    super.init(coder: decoder)
    
    loadingIdc.isHidden = true
    loadingIdc.minValue = 0
    loadingIdc.maxValue = 0
    loadingIdc.usesThreadedAnimation = true
    loadingIdc.isIndeterminate = true
    loadingIdc.style = .spinning
    addSubview(loadingIdc)
    
    artworkImg.isHidden = false
    artworkImg.imageFrameStyle = .none
    artworkImg.image = NSImage(imageLiteralResourceName: "PlaceholderIcon")
    addSubview(artworkImg)
    
    reverseBtn.stringValue = ""
    reverseBtn.bezelStyle = .texturedRounded
    reverseBtn.image = NSImage(imageLiteralResourceName: "ReverseIcon")
    reverseBtn.action = #selector(skipBack)
    reverseBtn.target = self
    addSubview(reverseBtn)
    
    playBtn.stringValue = ""
    playBtn.bezelStyle = .texturedRounded
    playBtn.image = playIcon
    playBtn.action = #selector(playPause)
    playBtn.target = self
    addSubview(playBtn)
    
    forwardBtn.stringValue = ""
    forwardBtn.bezelStyle = .texturedRounded
    forwardBtn.image = NSImage(imageLiteralResourceName: "ForwardIcon")
    forwardBtn.action = #selector(skipAhead)
    forwardBtn.target = self
    addSubview(forwardBtn)
    
    playedDurationLbl.stringValue = "0:00:00"
    playedDurationLbl.isBezeled = false
    playedDurationLbl.drawsBackground = false
    playedDurationLbl.isSelectable = false
    playedDurationLbl.alignment = .right
    playedDurationLbl.font = NSFont.systemFont(ofSize: 10)
    playedDurationLbl.isEditable = false
    addSubview(playedDurationLbl)
    
    seekSlider.minValue = 0
    seekSlider.maxValue = 1
    seekSlider.doubleValue = 0
    seekSlider.streamedValue = 0.1
    seekSlider.cell = SeekSliderCell()
    seekSlider.target = self
    seekSlider.action = #selector(seek)
    addSubview(seekSlider)
    
    playedRemainingLbl.stringValue = "0:00:00"
    playedRemainingLbl.isBezeled = false
    playedRemainingLbl.drawsBackground = false
    playedRemainingLbl.isSelectable = false
    playedRemainingLbl.font = NSFont.systemFont(ofSize: 10)
    playedRemainingLbl.isEditable = false
    addSubview(playedRemainingLbl)
 }
  
  override func draw(_ dirtyRect: NSRect) {
    if self.window?.isMainWindow ?? false {
      let bgGradient = NSGradient(starting: NSColor(calibratedRed: 0.945, green: 0.945, blue: 0.945, alpha: 1.0), ending: NSColor(calibratedRed: 0.894, green: 0.894, blue: 0.894, alpha: 1.0))
      bgGradient?.draw(in: self.bounds, angle: 270)
      
      NSColor(calibratedRed: 0.784, green: 0.784, blue: 0.784, alpha: 1.0).setStroke()
    } else {
      let bgGradient = NSGradient(starting: NSColor(calibratedRed: 0.980, green: 0.980, blue: 0.980, alpha: 1.0), ending: NSColor(calibratedRed: 0.980, green: 0.980, blue: 0.980, alpha: 1.0))
      bgGradient?.draw(in: self.bounds, angle: 270)
      
      NSColor(calibratedRed: 0.902, green: 0.902, blue: 0.902, alpha: 1.0).setStroke()
    }
    
    let leftBorder = NSBezierPath()
    leftBorder.move(to: NSPoint(x: 0.5, y: 0))
    leftBorder.line(to: NSPoint(x: 0.5, y: self.bounds.size.height))
    leftBorder.stroke()
    
    let rightBorder = NSBezierPath()
    rightBorder.move(to: NSPoint(x: self.bounds.size.width - 0.5, y: 0))
    rightBorder.line(to: NSPoint(x: self.bounds.size.width - 0.5, y: self.bounds.size.height))
    rightBorder.stroke()
    
    super.draw(dirtyRect)
  }
  
  func formatTime(total: Int) -> String {
    let hrs = Int(floor(Double(total / 3600)))
    let mins = Int(floor(Double((total % 3600) / 60)))
    let secs = Int(total % 60)
    
    return String(hrs) + ":" + String(mins).leftPadding(toLength: 2, withPad: "0") + ":" + String(secs).leftPadding(toLength: 2, withPad: "0")
  }
  
  func updateForEpisode(episode: Episode) {
    let loadStatus = Player.global.loadStatus
    
    if loadStatus == .loading {
      loadingIdc.isHidden = false
      loadingIdc.startAnimation(nil)
      artworkImg.isHidden = true
    } else {
      loadingIdc.isHidden = true
      loadingIdc.stopAnimation(nil)
      artworkImg.isHidden = false
    }
    
  }
  
  func updatePlayback() {
    let duration = Player.global.duration
    let position = Player.global.position
    
    playedDurationLbl.stringValue = formatTime(total: Int(position))
    playedRemainingLbl.stringValue = formatTime(total: Int(duration - position))
    
    seekSlider.minValue = 0
    seekSlider.maxValue = duration
    seekSlider.doubleValue = position
    seekSlider.streamedValue = Player.global.buffered
  }
  
  @objc func seek(_ sender: Any) {
    let event = NSApplication.shared.currentEvent
    // Only react to dragging so that we don't skip back after slider release
    if event?.type == .leftMouseDragged {
      Player.global.seek(seconds: seekSlider.doubleValue)
    }
  }
  
  @objc func playPause(_ sender: Any) {
    if Player.global.isPlaying() {
      Player.global.pause()
      playBtn.image = playIcon
    } else if (Player.global.canPlay()) {
      Player.global.play()
      playBtn.image = pauseIcon
    }
  }
  
  @objc func skipAhead(_ sender: Any) {
    
  }
  
  @objc func skipBack(_ sender: Any) {
    
  }
  
  static private func controlX(_ view: NSView) -> CGFloat {
    return view.frame.origin.x + view.frame.size.width
  }
}