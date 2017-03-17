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

import Logger from '../logger'

const MIGRATIONS = [
  // 1: Create Podcasts
  `CREATE TABLE podcasts (
    id INTEGER PRIMARY KEY,
    title TEXT,
    feed TEXT,
    description TEXT,
    link TEXT,
    author TEXT,
    pub_date DATETIME,
    language TEXT,
    copyright TEXT,
    image_url TEXT,
    image_blob BLOB,
    last_parsed DATE,
    created_at DATE,
    updated_at DATE,
    download_new BOOL,
    delete_played BOOL
  )
  `,
  `CREATE TABLE episodes (
    id INTEGER PRIMARY KEY,
    podcast_id INTEGER,
    title TEXT,
    description TEXT,
    guid TEXT,
    pub_date DATETIME,
    link TEXT,
    enclosure_url TEXT,
    enclosure_size INTEGER,
    favourite BOOL,
    downloaded BOOL,
    played BOOL,
    play_position INTEGER,
    created_at DATE,
    updated_at DATE
  )
  `
]

export default class Migrations {
  static nextUpVersion(db, callback) {
    db.query("PRAGMA user_version").spread((results, m) => {
      callback(results[0].user_version)
    })
  }

  static perform(db, version, callback) {
    db.query(MIGRATIONS[version]).spread((results, m) => {
      const nextUpVersion = version + 1
      db.query(`PRAGMA user_version = ${nextUpVersion}`).spread((results, m) => {
        callback()
      })
    })
  }

  static migrate(sequelize, done) {
    // Subtract 1 from both sides so that we end up with an 0 based index
    const latest = MIGRATIONS.length

    Migrations.nextUpVersion(sequelize, (nextUp) => {
      if (nextUp < latest) {
        Logger.info(`Migrating from version ${nextUp} to ${latest}`)
        Migrations.perform(sequelize, nextUp, () => {
          Migrations.migrate(sequelize, done)
        })
      } else {
        // We are up to date
        done()
      }
    })
  }
}