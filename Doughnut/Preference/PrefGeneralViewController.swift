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
import MASPreferences

@objcMembers
class PrefGeneralViewController: NSViewController, MASPreferencesViewController {
  static func instantiate() -> PrefGeneralViewController {
    let storyboard = NSStoryboard(name: NSStoryboard.Name(rawValue: "Preferences"), bundle: nil)
    return storyboard.instantiateController(withIdentifier: NSStoryboard.SceneIdentifier("PrefGeneralViewController")) as! PrefGeneralViewController
  }
  
  var viewIdentifier: String = "PrefGeneralViewController"
  
  var toolbarItemImage: NSImage? {
    get {
      return NSImage(named: .preferencesGeneral)!
    }
  }
  
  var toolbarItemLabel: String? {
    get {
      view.layoutSubtreeIfNeeded()
      return " General "
    }
  }
  
  override func viewDidAppear() {
    super.viewDidAppear()
  }
  
  var hasResizableWidth: Bool = false
  var hasResizableHeight: Bool = false
}

