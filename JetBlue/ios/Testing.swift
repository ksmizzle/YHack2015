//
//  Testing.swift
//  JetBlue
//
//  Created by Kevin Yang on 11/7/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

import UIKit

@objc(Testing)
class Testing: NSObject {
  @objc func addEvent() -> Void {
    for family: String in UIFont.familyNames()
    {
      print("\(family)")
      for names: String in UIFont.fontNamesForFamilyName(family)
      {
        print("== \(names)")
      }
    }
  }
}
