//
//  ViewController.swift
//  Doughnut
//
//  Created by Chris Dyer on 22/09/2017.
//  Copyright © 2017 Chris Dyer. All rights reserved.
//

import Cocoa

class ViewController: NSSplitViewController {

  override func viewDidLoad() {
    super.viewDidLoad()

    // Do any additional setup after loading the view.
  }

  override var representedObject: Any? {
    didSet {
    // Update the view, if already loaded.
    }
  }

  @IBAction func play(_ sender: NSSegmentedControl) {
    let alert = NSAlert()
    alert.messageText = "Hello World"
    alert.runModal()
  }
  
}

